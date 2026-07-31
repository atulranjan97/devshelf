// Mock data source for the dashboard UI. Replace with Prisma queries once the database is wired up.

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  kind: "TEXT" | "URL" | "FILE";
  icon: string;
  color: string;
  isPro: boolean;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  language: string | null;
  url: string | null;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  defaultTypeId: string;
  isFavorite: boolean;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "Demo User",
  email: "demo@devshelf.io",
  image: null,
  isPro: false,
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippet", slug: "snippets", kind: "TEXT", icon: "Code", color: "#3b82f6", isPro: false },
  { id: "type_prompt", name: "Prompt", slug: "prompts", kind: "TEXT", icon: "Sparkles", color: "#8b5cf6", isPro: false },
  { id: "type_note", name: "Note", slug: "notes", kind: "TEXT", icon: "StickyNote", color: "#fde047", isPro: false },
  { id: "type_command", name: "Command", slug: "commands", kind: "TEXT", icon: "Terminal", color: "#f97316", isPro: false },
  { id: "type_link", name: "Link", slug: "links", kind: "URL", icon: "Link", color: "#10b981", isPro: false },
  { id: "type_file", name: "File", slug: "files", kind: "FILE", icon: "File", color: "#6b7280", isPro: true },
  { id: "type_image", name: "Image", slug: "images", kind: "FILE", icon: "Image", color: "#ec4899", isPro: true },
];

export const mockItemTypeCounts: Record<string, number> = {
  type_snippet: 24,
  type_prompt: 18,
  type_command: 15,
  type_note: 12,
  type_file: 5,
  type_image: 3,
  type_link: 8,
};

export const collections: MockCollection[] = [
  { id: "col_react_patterns", name: "React Patterns", description: "Common React patterns and hooks", defaultTypeId: "type_snippet", isFavorite: true },
  { id: "col_python_snippets", name: "Python Snippets", description: "Useful Python code snippets", defaultTypeId: "type_snippet", isFavorite: false },
  { id: "col_context_files", name: "Context Files", description: "AI context files for projects", defaultTypeId: "type_note", isFavorite: true },
  { id: "col_interview_prep", name: "Interview Prep", description: "Technical interview preparation", defaultTypeId: "type_note", isFavorite: false },
  { id: "col_git_commands", name: "Git Commands", description: "Frequently used git commands", defaultTypeId: "type_command", isFavorite: true },
  { id: "col_ai_prompts", name: "AI Prompts", description: "Curated AI prompts for coding", defaultTypeId: "type_prompt", isFavorite: false },
];

export const items: MockItem[] = [
  {
    id: "item_use_auth_hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    content: "export function useAuth() {\n  // ...\n}",
    language: "tsx",
    url: null,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react_patterns"],
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    updatedAt: "2026-01-15",
  },
  {
    id: "item_api_error_handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    content: "async function fetchWithRetry(url: string) {\n  // ...\n}",
    language: "ts",
    url: null,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react_patterns", "col_interview_prep"],
    tags: ["fetch", "error-handling"],
    isFavorite: false,
    isPinned: true,
    updatedAt: "2026-01-12",
  },
  {
    id: "item_git_rebase_interactive",
    title: "Interactive rebase last N commits",
    description: "Squash and reorder recent commits before pushing",
    content: "git rebase -i HEAD~5",
    language: "bash",
    url: null,
    itemTypeId: "type_command",
    collectionIds: ["col_git_commands"],
    tags: ["git", "rebase"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-10",
  },
  {
    id: "item_refactor_prompt",
    title: "Refactor system prompt",
    description: "Prompt for refactoring code while preserving behavior",
    content: "You are a senior engineer refactoring the following code...",
    language: null,
    url: null,
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai_prompts"],
    tags: ["ai", "refactor"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-01-08",
  },
  {
    id: "item_docker_prune",
    title: "docker prune everything",
    description: "Remove all unused containers, images, and volumes",
    content: "docker system prune -a --volumes",
    language: "bash",
    url: null,
    itemTypeId: "type_command",
    collectionIds: ["col_git_commands"],
    tags: ["docker", "cleanup"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-05",
  },
  {
    id: "item_project_context",
    title: "DevShelf project context",
    description: "AI context file summarizing the DevShelf project",
    content: "# DevShelf\nA developer knowledge hub...",
    language: "md",
    url: null,
    itemTypeId: "type_note",
    collectionIds: ["col_context_files"],
    tags: ["context", "ai"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-03",
  },
  {
    id: "item_nextjs_docs",
    title: "Next.js Documentation",
    description: "Official Next.js docs",
    content: null,
    language: null,
    url: "https://nextjs.org/docs",
    itemTypeId: "type_link",
    collectionIds: ["col_interview_prep"],
    tags: ["nextjs", "docs"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2025-12-28",
  },
];
