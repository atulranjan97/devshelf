## Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earlist to latest -->

- 2026-07-31: Initial Next.js and Tailwind setup — removed default Create Next App boilerplate assets, added project context docs, committed (`chore: initial next.js and tailwind setup`) and pushed to `origin/main`.
- 2026-07-31: Dashboard UI Phase 1 — ShadCN UI initialized, dark mode set by default, `/dashboard` route added with top bar (logo, search, New Collection, New Item) and placeholder Sidebar/Main sections. Build passes.
- 2026-08-01: Dashboard UI Phase 2 — collapsible sidebar (shadcn Sidebar primitive) with item type links, favorite/recent collections (collapsible, with item-count badges), user avatar footer, mobile drawer with hamburger trigger and close button, and a full-width top bar with the sidebar docked below it. Fixed a pre-existing `use-mobile` hydration/lint issue along the way (switched to `useSyncExternalStore`). Build and lint pass.