---
name: looker-mobile-design
description: Use this skill to generate well-branded Looker mobile (iOS) interfaces and assets — production code or throwaway prototypes, mocks, slides, and screen recreations. Contains design guidelines, colors, type, fonts, assets, and a React UI kit for the Looker iOS app: dashboards, Looks, boards, folders, recents, favorites, alerts.
user-invocable: true
---

# Looker Mobile Design System

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/mobile/`).

## When making artifacts
If creating visual artifacts (slides, mocks, throwaway prototypes, screen recreations):
1. Read `README.md` for product context, content rules, and visual foundations.
2. Read `colors_and_type.css` to learn the design tokens — use them, do not redefine colors / type scales.
3. Copy the assets you need (`assets/looker-app-icon.svg`, `assets/looker-wordmark.svg`) — don't reference cross-project paths.
4. Use the `LookerComponents` library at `ui_kits/mobile/LookerComponents.jsx` for primitives (`LkrTopNav`, `LkrTabBar`, `LkrContentCard`, `LkrDashboardTile`, `LkrKpi`, `LkrSparkline`, `LkrChip`, `LkrSheet`, etc.).
5. Wrap mobile screens in the `IOSDevice` frame from `ui_kits/mobile/ios-frame.jsx` for proper status bar + home indicator.
6. Follow the content rules: sentence case everywhere, second person, no emoji, signed deltas with the minus glyph (−), tabular figures, no exclamation points.

## When working on production code
Copy `colors_and_type.css` into the project, lift token values into the platform's idiomatic format (SwiftUI `Color` extensions, CSS custom properties, etc.), and use Material Symbols Rounded as the icon system.

## When invoked without other guidance
Ask the user:
1. What screen / artifact do they want? (e.g. dashboard view, login flow, alert push card, marketing one-pager)
2. Light or dark theme?
3. iPhone size? (default: 402×874 = iPhone 16 / 15 Pro)
4. Any specific brand variant? (default Looker on Google Cloud)

Then act as an expert designer who outputs an HTML artifact under the Looker mobile aesthetic, or production code, depending on the need.

## Caveats baked into this skill

- Brand font **Google Sans** is substituted with **Roboto** because Google Sans is not publicly distributed. Same for **Google Sans Code** → **Roboto Mono**. If real font files become available, drop them into a `fonts/` folder and update the `@font-face` block in `colors_and_type.css`.
- The original source repo (`contactkram/lookermobile`) was empty when this system was built. Recreations are based on Looker's *public* docs and the Google Cloud brand. For higher fidelity, push real source and re-invoke.

## File map

```
README.md                          ← product context, content + visual rules
SKILL.md                           ← this file
colors_and_type.css                ← all CSS tokens (colors, type, spacing, motion, elevation)
assets/                            ← logos, brand marks
  looker-app-icon.svg
  looker-wordmark.svg
  looker-wordmark-dark.svg
  looker-lockup.svg
preview/                           ← Design System tab cards
ui_kits/
  mobile/                          ← Looker iOS UI kit (interactive)
    README.md                      ← kit-specific notes
    index.html                     ← interactive prototype
    ios-frame.jsx                  ← iPhone device frame
    LookerComponents.jsx           ← all UI primitives
    LookerApp.jsx                  ← top-level navigation
    RecentsScreen.jsx              ← default landing
    FavoritesScreen.jsx
    FoldersScreen.jsx
    BoardsScreen.jsx
    AlertsScreen.jsx
    DashboardScreen.jsx            ← dashboard with KPI / chart tiles
    LookScreen.jsx                 ← single-viz view
```
