## Current Feature

Seed Data — create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos.

## Status

Completed

## Goals

- Seed a demo user (`demo@devstash.io`, password hashed with bcryptjs)
- Seed the 7 system item types (snippet, prompt, command, note, file, image, link)
- Seed 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with their items per the spec

## Notes

- Full spec: `context/features/seed-spec.md`



## History

<!-- Keep this updated. Earlist to latest -->

- 2026-07-31: Initial Next.js and Tailwind setup — removed default Create Next App boilerplate assets, added project context docs, committed (`chore: initial next.js and tailwind setup`) and pushed to `origin/main`.
- 2026-07-31: Dashboard UI Phase 1 — ShadCN UI initialized, dark mode set by default, `/dashboard` route added with top bar (logo, search, New Collection, New Item) and placeholder Sidebar/Main sections. Build passes.
- 2026-08-01: Dashboard UI Phase 2 — collapsible sidebar (shadcn Sidebar primitive) with item type links, favorite/recent collections (collapsible, with item-count badges), user avatar footer, mobile drawer with hamburger trigger and close button, and a full-width top bar with the sidebar docked below it. Fixed a pre-existing `use-mobile` hydration/lint issue along the way (switched to `useSyncExternalStore`). Build and lint pass.
- 2026-08-02: Dashboard UI Phase 3 — main dashboard area: 4 stats cards (items, collections, favorite items, favorite collections), recent collections grid, pinned items, and 10 recent items, sharing common ItemRow/CollectionCard styling with type-colored borders and hover-ring highlights. Extracted item-type icon lookup into a shared lib module. Switched app font from Geist to Inter, fixing a pre-existing `--font-sans` variable mismatch. Build and lint pass. Merged to main.
- 2026-08-02: Prisma + Neon PostgreSQL setup — installed Prisma 7.9.1, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`; converted the project to ESM (`"type": "module"`, `tsconfig` target `ES2023`) since Prisma 7 is ESM-only. Wrote `prisma/schema.prisma` with the full data model from `project-overview.md` (User/Account/Session/VerificationToken for NextAuth, plus ItemType/Item/Collection/ItemCollection/Tag/ItemTag), generator output at `src/generated/prisma` (gitignored). Prisma 7 no longer allows a `url` in the `datasource` block — connection info now lives in `prisma.config.ts` (CLI/migrations, via `DIRECT_URL`) and the `PrismaPg` adapter in `src/lib/prisma.ts` (runtime, via pooled `DATABASE_URL`); split the two because Neon's PgBouncer pooler can't run the shadow-database operations `migrate dev` needs. Applied two migrations (`init`, `itemtype_system_slug_unique` — the hand-written partial unique index for system item type slugs, since Postgres treats each `NULL userId` as distinct). Added `scripts/test-db.ts` (run via `npx tsx scripts/test-db.ts`) to sanity-check the connection. Build and lint pass; migration verified against the Neon dev branch.
- 2026-08-03: Seed data — added `prisma/seed.ts` per `context/features/seed-spec.md`, wired up via `migrations.seed` in `prisma.config.ts` (Prisma 7 removed automatic seeding on `migrate dev`/`reset`; it now only runs via `npx prisma db seed`). Installed `bcryptjs` to hash the demo user's password (12 rounds). Seeds one demo user, all 7 system item types, and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) totaling 18 items across snippets, prompts, commands, and links (real URLs for docs/design references). Script is idempotent — reruns via `findFirst`/`upsert` instead of blind creates, verified by running it twice and confirming row counts didn't change. Build and lint pass.