## Current Feature

Dashboard Items — Real Data

## Status

Completed

## Goals

- Replace dummy item data in the main dashboard area (pinned + recent items) with real data from Neon via Prisma, matching the existing layout/design.
- If there are no pinned items, nothing should display there.

## Notes

- Create `src/lib/db/items.ts` with data fetching functions.
- Fetch items directly in the server component.
- Item card icon/border derived from the item type.
- Display item type tags and anything else currently shown; reference `context/screenshots/dashboard-ui-main.png` if needed.
- Update collection stats display.
- Full spec: `context/features/dashboard-items-spec.md`.

## History

<!-- Keep this updated. Earlist to latest -->

- 2026-07-31: Initial Next.js and Tailwind setup — removed default Create Next App boilerplate assets, added project context docs, committed (`chore: initial next.js and tailwind setup`) and pushed to `origin/main`.
- 2026-07-31: Dashboard UI Phase 1 — ShadCN UI initialized, dark mode set by default, `/dashboard` route added with top bar (logo, search, New Collection, New Item) and placeholder Sidebar/Main sections. Build passes.
- 2026-08-01: Dashboard UI Phase 2 — collapsible sidebar (shadcn Sidebar primitive) with item type links, favorite/recent collections (collapsible, with item-count badges), user avatar footer, mobile drawer with hamburger trigger and close button, and a full-width top bar with the sidebar docked below it. Fixed a pre-existing `use-mobile` hydration/lint issue along the way (switched to `useSyncExternalStore`). Build and lint pass.
- 2026-08-02: Dashboard UI Phase 3 — main dashboard area: 4 stats cards (items, collections, favorite items, favorite collections), recent collections grid, pinned items, and 10 recent items, sharing common ItemRow/CollectionCard styling with type-colored borders and hover-ring highlights. Extracted item-type icon lookup into a shared lib module. Switched app font from Geist to Inter, fixing a pre-existing `--font-sans` variable mismatch. Build and lint pass. Merged to main.
- 2026-08-02: Prisma + Neon PostgreSQL setup — installed Prisma 7.9.1, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`; converted the project to ESM (`"type": "module"`, `tsconfig` target `ES2023`) since Prisma 7 is ESM-only. Wrote `prisma/schema.prisma` with the full data model from `project-overview.md` (User/Account/Session/VerificationToken for NextAuth, plus ItemType/Item/Collection/ItemCollection/Tag/ItemTag), generator output at `src/generated/prisma` (gitignored). Prisma 7 no longer allows a `url` in the `datasource` block — connection info now lives in `prisma.config.ts` (CLI/migrations, via `DIRECT_URL`) and the `PrismaPg` adapter in `src/lib/prisma.ts` (runtime, via pooled `DATABASE_URL`); split the two because Neon's PgBouncer pooler can't run the shadow-database operations `migrate dev` needs. Applied two migrations (`init`, `itemtype_system_slug_unique` — the hand-written partial unique index for system item type slugs, since Postgres treats each `NULL userId` as distinct). Added `scripts/test-db.ts` (run via `npx tsx scripts/test-db.ts`) to sanity-check the connection. Build and lint pass; migration verified against the Neon dev branch.
- 2026-08-03: Seed data — added `prisma/seed.ts` per `context/features/seed-spec.md`, wired up via `migrations.seed` in `prisma.config.ts` (Prisma 7 removed automatic seeding on `migrate dev`/`reset`; it now only runs via `npx prisma db seed`). Installed `bcryptjs` to hash the demo user's password (12 rounds). Seeds one demo user, all 7 system item types, and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) totaling 18 items across snippets, prompts, commands, and links (real URLs for docs/design references). Script is idempotent — reruns via `findFirst`/`upsert` instead of blind creates, verified by running it twice and confirming row counts didn't change. Build and lint pass.
- 2026-08-03: Dashboard Collections — Real Data, per `context/features/dashboard-collections-spec.md`. Added `src/lib/db/collections.ts` (`getRecentCollections`), fetched from a new async server component in `CollectionsSection.tsx` — replaces `@/lib/mock-data` for the Recent Collections grid. Border color now derives from the most-used item type in each collection (falls back to the collection's `defaultType` when empty); type icons row reflects the real distinct types present. Query is keyed off the seeded demo user's email as a stand-in until Auth.js sessions exist. Marked `/dashboard` `export const dynamic = "force-dynamic"` since it was building fully static and would have baked the DB query result in at build time. Scope intentionally excludes `StatsCards` (Items/Collections/Favorite counts remain on mock data) and the per-collection item list (`PinnedItems`/`RecentItems`), both deferred to a later feature. Build and lint pass.
- 2026-08-04: Dashboard Items — Real Data, per `context/features/dashboard-items-spec.md`. Added `src/lib/db/items.ts` (`getPinnedItems`, `getRecentItems`, `getItemStats`) and `getCollectionStats` in `src/lib/db/collections.ts`; `ItemRow`, `PinnedItems`, `RecentItems`, and `StatsCards` are now async server components on real Prisma data instead of `@/lib/mock-data`. Item card icon/border color derive from the real `itemType` relation; tags come from the `ItemTag`/`Tag` join. `PinnedItems` renders nothing when there are no pinned items (matches spec — current seed data has none). Verified by fetching the rendered `/dashboard` HTML directly: stats show real counts (18 items, 5 collections, 0 favorites, matching seed data) and Recent Items lists 10 real items with correct per-type icon/color. Scope intentionally excludes `AppSidebar`'s per-type/per-collection counts, still on mock data. Build and lint pass.