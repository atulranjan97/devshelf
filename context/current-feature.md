## Current Feature

Prisma + Neon PostgreSQL Setup — set up Prisma ORM with a Neon PostgreSQL database, including the initial schema and NextAuth models.

## Status

Completed

## Goals

- Use Neon PostgreSQL (serverless)
- Create initial schema based on the data models in `context/project-overview.md` (will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## Notes

- Use Prisma 7 (breaking changes vs. earlier versions) — read the full upgrade guide at https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7 before scaffolding.
- Setup reference: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- We have a development Neon branch (`DATABASE_URL`) and a separate production branch. Always create migrations (`prisma migrate dev`) and never push schema changes directly, unless explicitly specified otherwise.
- Full spec: `context/features/database-spec.md`

## History

<!-- Keep this updated. Earlist to latest -->

- 2026-07-31: Initial Next.js and Tailwind setup — removed default Create Next App boilerplate assets, added project context docs, committed (`chore: initial next.js and tailwind setup`) and pushed to `origin/main`.
- 2026-07-31: Dashboard UI Phase 1 — ShadCN UI initialized, dark mode set by default, `/dashboard` route added with top bar (logo, search, New Collection, New Item) and placeholder Sidebar/Main sections. Build passes.
- 2026-08-01: Dashboard UI Phase 2 — collapsible sidebar (shadcn Sidebar primitive) with item type links, favorite/recent collections (collapsible, with item-count badges), user avatar footer, mobile drawer with hamburger trigger and close button, and a full-width top bar with the sidebar docked below it. Fixed a pre-existing `use-mobile` hydration/lint issue along the way (switched to `useSyncExternalStore`). Build and lint pass.
- 2026-08-02: Dashboard UI Phase 3 — main dashboard area: 4 stats cards (items, collections, favorite items, favorite collections), recent collections grid, pinned items, and 10 recent items, sharing common ItemRow/CollectionCard styling with type-colored borders and hover-ring highlights. Extracted item-type icon lookup into a shared lib module. Switched app font from Geist to Inter, fixing a pre-existing `--font-sans` variable mismatch. Build and lint pass. Merged to main.
- 2026-08-02: Prisma + Neon PostgreSQL setup — installed Prisma 7.9.1, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`; converted the project to ESM (`"type": "module"`, `tsconfig` target `ES2023`) since Prisma 7 is ESM-only. Wrote `prisma/schema.prisma` with the full data model from `project-overview.md` (User/Account/Session/VerificationToken for NextAuth, plus ItemType/Item/Collection/ItemCollection/Tag/ItemTag), generator output at `src/generated/prisma` (gitignored). Prisma 7 no longer allows a `url` in the `datasource` block — connection info now lives in `prisma.config.ts` (CLI/migrations, via `DIRECT_URL`) and the `PrismaPg` adapter in `src/lib/prisma.ts` (runtime, via pooled `DATABASE_URL`); split the two because Neon's PgBouncer pooler can't run the shadow-database operations `migrate dev` needs. Applied two migrations (`init`, `itemtype_system_slug_unique` — the hand-written partial unique index for system item type slugs, since Postgres treats each `NULL userId` as distinct). Added `scripts/test-db.ts` (run via `npx tsx scripts/test-db.ts`) to sanity-check the connection. Build and lint pass; migration verified against the Neon dev branch.