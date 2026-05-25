# Looker iOS · UI kit

Interactive recreation of the Looker mobile (iOS) app, built on the foundations in `../../colors_and_type.css` and components from this folder.

## Open
- **`index.html`** — interactive prototype in an iPhone frame. Tap around: open dashboards, favorite items, change tabs, open the three-dot menu, change filters.

## Coverage

| Screen | File | Notes |
| --- | --- | --- |
| Recents | `RecentsScreen.jsx` | Default landing. Search, type/sort chips, content cards. |
| Favorites | `FavoritesScreen.jsx` | Mirrors recents, filtered to starred items. Has an empty state. |
| Folders | `FoldersScreen.jsx` | Hierarchical browse: personal, shared, LookML. |
| Boards | `BoardsScreen.jsx` | 2-column grid of curated collections. |
| Alerts | `AlertsScreen.jsx` | Push-style notifications for tile thresholds. |
| Dashboard view | `DashboardScreen.jsx` | KPIs, sparkline, bar chart, top-N list. Filter bar + three-dot. |
| Look view | `LookScreen.jsx` | Single visualization with summary stats. |
| Filter sheet | (inside `LookerApp.jsx`) | Bottom modal with chip groups + Apply/Reset. |
| Three-dot menu | (inside `LookerApp.jsx`) | Bottom sheet: Favorite, Share, Copy link, Create alert, Get info. |

## Component library

All primitives in `LookerComponents.jsx`, exported on `window`:

- **Chrome:** `LkrTopNav`, `LkrLargeTitle`, `LkrTabBar`, `LkrSection`
- **Lists & cards:** `LkrListGroup`, `LkrRow`, `LkrContentCard`, `LkrDashboardTile`
- **Inputs:** `LkrSearch`, `LkrChip`, `LkrChipRow`, `LkrButton`
- **Data viz:** `LkrKpi`, `LkrSparkline`, `LkrBarChart`
- **Overlays:** `LkrSheet`
- **Misc:** `LkrIcon` (Material Symbols Rounded wrapper), `LkrAvatar`, `LkrEmptyState`
- **Tokens:** `LKR_TOKENS` — color + font constants for use in screen files

## Conventions

- Each screen file `export`s a single component to `window` and consumes primitives from `window.*`.
- Screen components receive *callbacks* (open / favorite / show menu) — no global routing.
- `LookerApp.jsx` is the only place that owns navigation state and the favorites Set.
- All copy follows the rules in `../../README.md` — sentence case, second person, no emoji, signed deltas, tabular figures.

## What's intentionally NOT here

- **Authoring** — Looker mobile is read-only by design. No "create dashboard" flows.
- **Drilling** — the real app doesn't support drill on mobile (per Google docs).
- **Real charts** — `LkrSparkline` and `LkrBarChart` are stylistic placeholders. Drop in `@nivo`/`recharts` for production. Tile color mapping should come from the Looker color collection.
- **Login / OAuth** — biometric + Google OAuth screens not modeled. Add when needed.

## Iterating

When the user pushes real iOS source (Swift / SwiftUI) to `contactkram/lookermobile`, re-invoke the design-system skill — we'll mirror the actual layouts, gestures, and surface treatments rather than reconstructing them from public docs.
