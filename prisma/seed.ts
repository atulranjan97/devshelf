import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import type { ItemKind } from "../src/generated/prisma/client";

const SYSTEM_ITEM_TYPES: {
  name: string;
  slug: string;
  kind: ItemKind;
  icon: string;
  color: string;
  isPro: boolean;
}[] = [
  { name: "Snippet", slug: "snippets", kind: "TEXT", icon: "Code", color: "#3b82f6", isPro: false },
  { name: "Prompt", slug: "prompts", kind: "TEXT", icon: "Sparkles", color: "#8b5cf6", isPro: false },
  { name: "Command", slug: "commands", kind: "TEXT", icon: "Terminal", color: "#f97316", isPro: false },
  { name: "Note", slug: "notes", kind: "TEXT", icon: "StickyNote", color: "#fde047", isPro: false },
  { name: "File", slug: "files", kind: "FILE", icon: "File", color: "#6b7280", isPro: true },
  { name: "Image", slug: "images", kind: "FILE", icon: "Image", color: "#ec4899", isPro: true },
  { name: "Link", slug: "links", kind: "URL", icon: "Link", color: "#10b981", isPro: false },
];

async function seedUser() {
  const passwordHash = await bcrypt.hash("12345678", 12);

  return prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
}

async function seedItemTypes() {
  const types: Record<string, Awaited<ReturnType<typeof prisma.itemType.create>>> = {};

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { slug: type.slug, userId: null },
    });

    types[type.slug] = existing
      ? existing
      : await prisma.itemType.create({
          data: { ...type, isSystem: true, userId: null },
        });
  }

  return types;
}

async function seedCollection(
  userId: string,
  name: string,
  description: string,
  defaultTypeId: string,
) {
  return prisma.collection.upsert({
    where: { userId_name: { userId, name } },
    update: {},
    create: { userId, name, description, defaultTypeId },
  });
}

async function seedItem(
  userId: string,
  itemTypeId: string,
  collectionId: string,
  data: { title: string; content?: string; language?: string; url?: string },
) {
  let item = await prisma.item.findFirst({
    where: { userId, itemTypeId, title: data.title },
  });

  if (!item) {
    item = await prisma.item.create({
      data: { userId, itemTypeId, ...data },
    });
  }

  await prisma.itemCollection.upsert({
    where: { itemId_collectionId: { itemId: item.id, collectionId } },
    update: {},
    create: { itemId: item.id, collectionId },
  });

  return item;
}

async function main() {
  const user = await seedUser();
  const types = await seedItemTypes();

  // ── React Patterns ──────────────────────────────
  const reactPatterns = await seedCollection(
    user.id,
    "React Patterns",
    "Reusable React patterns and hooks",
    types.snippets.id,
  );

  await seedItem(user.id, types.snippets.id, reactPatterns.id, {
    title: "useDebounce & useLocalStorage Hooks",
    language: "tsx",
    content: `function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
  });

  await seedItem(user.id, types.snippets.id, reactPatterns.id, {
    title: "Compound Component Pattern",
    language: "tsx",
    content: `const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null);

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="flex flex-col gap-2">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="flex gap-1">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within Tabs");
  return (
    <button onClick={() => ctx.setActive(id)} data-active={ctx.active === id}>
      {children}
    </button>
  );
}

Tabs.List = TabList;
Tabs.Tab = Tab;`,
  });

  await seedItem(user.id, types.snippets.id, reactPatterns.id, {
    title: "Array & Object Utility Functions",
    language: "ts",
    content: `export function groupBy<T, K extends PropertyKey>(items: T[], key: (item: T) => K) {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}`,
  });

  // ── AI Workflows ─────────────────────────────────
  const aiWorkflows = await seedCollection(
    user.id,
    "AI Workflows",
    "AI prompts and workflow automations",
    types.prompts.id,
  );

  await seedItem(user.id, types.prompts.id, aiWorkflows.id, {
    title: "Code Review Prompt",
    content: `Review the following code for correctness, security, and readability. Call out:
1. Bugs or edge cases that aren't handled
2. Security issues (injection, auth, unsafe input handling)
3. Naming, structure, or duplication that could be simplified

Be specific — cite line numbers and suggest a concrete fix, not just "consider improving this."

Code:
{{code}}`,
  });

  await seedItem(user.id, types.prompts.id, aiWorkflows.id, {
    title: "Documentation Generator Prompt",
    content: `Generate documentation for the following function/module. Include:
- A one-sentence summary of what it does
- Parameters with types and descriptions
- Return value
- One usage example

Keep it concise — no restating what the code obviously already says.

Code:
{{code}}`,
  });

  await seedItem(user.id, types.prompts.id, aiWorkflows.id, {
    title: "Refactoring Assistant Prompt",
    content: `Refactor the following code to improve readability and maintainability without changing its behavior. Preserve the existing public API. Explain each change in one line.

Constraints:
- Don't introduce new dependencies
- Keep the diff minimal and focused

Code:
{{code}}`,
  });

  // ── DevOps ───────────────────────────────────────
  const devops = await seedCollection(
    user.id,
    "DevOps",
    "Infrastructure and deployment resources",
    types.snippets.id,
  );

  await seedItem(user.id, types.snippets.id, devops.id, {
    title: "Multi-stage Dockerfile",
    language: "dockerfile",
    content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]`,
  });

  await seedItem(user.id, types.commands.id, devops.id, {
    title: "Deploy to Production",
    language: "bash",
    content: `# Build, tag, and push the image, then roll out
docker build -t registry.example.com/app:$(git rev-parse --short HEAD) .
docker push registry.example.com/app:$(git rev-parse --short HEAD)
kubectl set image deployment/app app=registry.example.com/app:$(git rev-parse --short HEAD)
kubectl rollout status deployment/app`,
  });

  await seedItem(user.id, types.links.id, devops.id, {
    title: "Docker Documentation",
    url: "https://docs.docker.com/",
  });

  await seedItem(user.id, types.links.id, devops.id, {
    title: "GitHub Actions Documentation",
    url: "https://docs.github.com/en/actions",
  });

  // ── Terminal Commands ────────────────────────────
  const terminalCommands = await seedCollection(
    user.id,
    "Terminal Commands",
    "Useful shell commands for everyday development",
    types.commands.id,
  );

  await seedItem(user.id, types.commands.id, terminalCommands.id, {
    title: "Git Essentials",
    language: "bash",
    content: `git switch -c feature/my-feature       # create + switch to a new branch
git add -p                             # stage changes interactively
git commit --amend --no-edit           # add staged changes to the last commit
git rebase -i HEAD~3                   # interactively rebase the last 3 commits
git log --oneline --graph --all        # visualize branch history`,
  });

  await seedItem(user.id, types.commands.id, terminalCommands.id, {
    title: "Docker Cheatsheet",
    language: "bash",
    content: `docker ps -a                          # list all containers
docker exec -it <container> sh        # shell into a running container
docker compose up -d --build          # rebuild and start in the background
docker system prune -af               # remove all unused containers/images/networks
docker logs -f <container>            # follow container logs`,
  });

  await seedItem(user.id, types.commands.id, terminalCommands.id, {
    title: "Process Management",
    language: "bash",
    content: `lsof -i :3000                # find what's using a port
kill -9 $(lsof -t -i:3000)   # force-kill whatever is on port 3000
ps aux | grep node           # list running node processes
top -o %CPU                  # sort processes by CPU usage`,
  });

  await seedItem(user.id, types.commands.id, terminalCommands.id, {
    title: "Package Manager Utilities",
    language: "bash",
    content: `npm outdated                  # list outdated dependencies
npm dedupe                    # flatten/dedupe the dependency tree
npx npm-check-updates -u      # bump package.json to latest versions
npm ls <package> --all        # find where a package is required from`,
  });

  // ── Design Resources ─────────────────────────────
  const designResources = await seedCollection(
    user.id,
    "Design Resources",
    "UI/UX resources and references",
    types.links.id,
  );

  await seedItem(user.id, types.links.id, designResources.id, {
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
  });

  await seedItem(user.id, types.links.id, designResources.id, {
    title: "shadcn/ui",
    url: "https://ui.shadcn.com",
  });

  await seedItem(user.id, types.links.id, designResources.id, {
    title: "Material Design 3",
    url: "https://m3.material.io",
  });

  await seedItem(user.id, types.links.id, designResources.id, {
    title: "Lucide Icons",
    url: "https://lucide.dev/icons",
  });

  console.log(`Seeded demo user ${user.email} with 5 collections and their items.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });