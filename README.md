# Looker Mobile Design System

A design system for building **Looker iOS** experiences — dashboards, Looks, boards, folders, and the surrounding navigation chrome — grounded in Google Cloud / Material 3 brand foundations and iOS Human Interface Guidelines.

> ⚠ **Source caveat — please read.**
> The user-provided repo [`contactkram/lookermobile`](https://github.com/contactkram/lookermobile) is currently **empty** (no commits). With no codebase or Figma to mirror, this system was reconstructed from publicly documented Looker brand & product facts:
> - Google Cloud / Google brand palette ([Google Blue #4285F4 + Material accents](https://about.google/brand-resource-center/))
> - [Looker mobile app docs](https://cloud.google.com/looker/docs/looker-core-mobile-app) (navigation surfaces, content model: Recents, Favorites, Folders, Boards, Dashboards, Looks)
> - [Looker color collections](https://cloud.google.com/looker/docs/color-collections) (categorical, sequential, diverging palettes)
> - Apple [iOS HIG](https://developer.apple.com/design/human-interface-guidelines/) for mobile chrome
>
> **To improve fidelity:** push real code to the repo (or attach screenshots, Figma frames, or the official `Looker.app` `Assets.car`) and re-invoke the system — we'll mirror the real product instead of reconstructing it.

---

## Product context

**Looker** is Google Cloud's BI / data exploration platform (acquired 2019 for $2.6B). The **Looker mobile app** (iOS / Android) is a *content-consumption* surface — not an authoring tool. The mental model:

| Concept | What it is |
| --- | --- |
| **Look** | A single saved query rendered as one visualization. |
| **Dashboard** | A vertical stack of dashboard *tiles* (charts + KPIs), filterable. |
| **Board** | A curated collection of Looks and dashboards, like a Pinterest board for data. |
| **Folder** | Hierarchical storage for the above. Personal + shared. |
| **Recents / Favorites** | Two top-level entry screens that anchor navigation. |

Users **browse, filter, drill (limited), share, and get alerts** on dashboard tiles. Auth is **Google OAuth / SAML / LDAP / OIDC**, with biometric sign-in for return visits.

The design language is **calm, dense, and chart-forward**. It is *not* flashy: the data is the hero, the chrome gets out of the way.

---

## Sources used

| Source | URL | Notes |
| --- | --- | --- |
| Empty GH repo | https://github.com/contactkram/lookermobile | **Empty — no files imported.** |
| Looker mobile docs | https://cloud.google.com/looker/docs/looker-core-mobile-app | Nav surfaces, content model |
| Looker dashboards (mobile) | https://cloud.google.com/looker/docs/mobile-app-viewing-dashboards | Tile layout, filter behavior |
| Looker Looks (mobile) | https://cloud.google.com/looker/docs/mobile-app-viewing-looks | Single-viz behavior, orientation |
| Looker color collections | https://cloud.google.com/looker/docs/color-collections | Categorical / sequential / diverging palettes |
| Google brand palette | Public Google Cloud brand docs | Blue / Red / Yellow / Green hex |
| Material 3 | https://m3.material.io/ | Elevation, motion, type scale |
| iOS HIG | https://developer.apple.com/design/human-interface-guidelines/ | Mobile chrome, safe areas, gestures |

---

## CONTENT FUNDAMENTALS

**Tone.** Calm, precise, neutral. Looker is enterprise BI — copy should respect that the user is at work, often looking for a specific number. Avoid marketing energy, avoid "we" voice in-product. **Direct, second-person ("you"), present tense.**

**Casing.** **Sentence case** everywhere — buttons, headers, menu items, section titles. Never Title Case in UI. Proper nouns capitalized (Look, Dashboard, Board, Folder *as product nouns*).

**Voice — first / second / third person.**
- *In-product UI:* second person ("Your dashboards", "Add to favorites")
- *Empty states:* second person, helpful ("You haven't favorited any dashboards yet.")
- *Errors:* describe what happened, never blame ("We couldn't load this dashboard. Check your connection and try again.")

**Vocabulary.** Use the product's own nouns with capital initials when referring to entities — *a Look*, *a Dashboard*, *a Board*, *a Folder*. Lowercase as plain words — *favorite this look*. Prefer *dashboard tiles* over *cards* / *widgets*. Prefer *filter* over *segment*.

**Specifics — examples in the wild:**
- Section: **Recently viewed** (not "Recents" header but "Recently viewed" in the title)
- Action: **Add to favorites** / **Remove from favorites**
- Action: **Get info**, **Copy link**, **Share**
- Empty: *"Nothing here yet"* + secondary line of context
- Loading: skeletons, never spinners with prose

**Numbers & data.** Always tabular figures (`font-feature-settings: "tnum"`). Always comma-thousands. Currency with symbol + locale (`$1.2M`, not `1.2 million dollars`). Percentages with `%` sign, no space (`+12.4%`). Deltas always signed (`+12.4%`, `−3.1%`, using the minus glyph, not hyphen).

**Emoji.** **No.** Google enterprise products do not use emoji in chrome. The only acceptable Unicode glyphs are mathematical (`±`, `−`, `×`, `→`) and the bullet `•`.

**Don'ts.** No exclamation points. No "Awesome!" / "Oops!" / "Whoops!". No "Let's get started." No first-person plural in-product.

---

## VISUAL FOUNDATIONS

### Color
- **Single hero hue: Google Blue `#4285F4`.** Used as the primary action color, link color, selection tint (at 50/100 weight for surfaces), and the dominant viz color.
- **Neutral ramp does the heavy lifting.** Surfaces are white on `#F8F9FA` grouped background. Text is `#202124` (primary), `#5F6368` (secondary), `#80868B` (tertiary).
- **Accents only for semantic meaning** — green for success / positive delta, red for danger / negative delta, yellow for warning. Never used decoratively.
- **Dark theme** is a true charcoal `#0F1115`, not pure black; cards rise to `#1B1D21`.

### Type
- **Google Sans** (brand) for headers, KPIs, and any "voice of the brand" surface. We substitute **Roboto** because Google Sans is not publicly distributed (see substitution note below).
- **Google Sans Text** (body) — substituted with **Roboto** at body sizes.
- **Google Sans Code** / **Roboto Mono** for data, LookML, IDs.
- Type scale is Material 3-derived; large title `34px` for screen titles, body `16px`, caption `12px`. **Never under 12px** on mobile.

### Imagery / illustration
- The product is essentially **chart-forward** — most "imagery" is the visualizations themselves.
- No stock photography in-product.
- Empty states use a single muted-blue line illustration or none at all (preferred: none).
- Charts inherit the categorical viz palette (8-color sequence rooted in `#4285F4`).

### Backgrounds
- **No gradients in chrome.** The only acceptable gradient is on the app icon (deep blue → bright blue, vertical) and inside data visualizations themselves (sequential palettes).
- No textures, no noise, no hand-drawn anything.
- Backgrounds are flat surfaces separated by hairline borders + 4-tier elevation shadows.

### Cards / surfaces
- **Dashboard tile** = white card, `12px` radius, `1px` hairline border `rgba(60,64,67,0.12)`, **no shadow at rest**. Hovered/pressed (on web) or selected (on mobile) tiles gain `elev-1` shadow.
- **Sheet / modal** = `16px` top-radius, white surface, `elev-3` shadow, dragger handle at top.
- **Content card** (folder browsing) = white, `12px` radius, hairline border, padded 16px, optional thumbnail at top.

### Borders & dividers
- **Hairlines** at `rgba(60,64,67,0.12)` (light) / `rgba(232,234,237,0.10)` (dark). 1px logical width, scaled to 0.5pt on iOS via `transform: scaleY(0.5)` for that crisp HIG feel.
- **Section dividers** in lists use full-bleed hairlines starting at the leading content edge (not the screen edge) — iOS HIG inset divider pattern.

### Shadows / elevation
Five tiers, Material 3 dual-shadow:
- `elev-0` flat (most resting cards)
- `elev-1` selected tile, raised button
- `elev-2` snackbar, menus
- `elev-3` modal sheet
- `elev-4` FAB pressed, dialog

### Corner radii
- `4px` chips, badges, inline controls
- `8px` small buttons, inputs
- `12px` cards, dashboard tiles (**default radius**)
- `16px` sheets, large cards
- `28px` FAB, full-pill primary CTA
- `999px` avatar, segmented pill

### Animation
- **Material 3 emphasized easing** `cubic-bezier(0.2, 0, 0, 1)` is the default.
- Durations: `150ms` fast (hover, ripple), `250ms` medium (most transitions), `400ms` slow (sheets, large enter/exit).
- **Page transitions** = iOS-native push (slide-from-right). **Sheet presentation** = bottom slide + scrim fade.
- No bounces, no springy overshoots. Calm and decisive.

### Hover / press / focus
- *Hover* (iPad / pointer): `4%` black overlay on the surface.
- *Press* (touch): `8%` black overlay + `scale(0.98)` for buttons. No long-press except for context menus on tiles.
- *Focus* (keyboard): `2px` `#1A73E8` ring at `2px` offset.
- *Ripple* used sparingly — only on Material-derived buttons, not on iOS-style row taps.

### Transparency & blur
- **Top navigation bar**: `backdrop-filter: blur(20px)` over `rgba(255,255,255,0.78)` (light) / `rgba(15,17,21,0.78)` (dark) when content scrolls underneath. Solid otherwise. iOS pattern, applied here.
- **Bottom tab bar**: same blur treatment.
- **Sheets**: solid surfaces, no blur. Scrim behind sheet is `rgba(32,33,36,0.5)`.

### Imagery vibe
- Chart-forward. When photography or generic imagery *is* used (rare — onboarding, marketing surfaces), it is **clean, warm-neutral, geometric**. Avoid stock-photo people.

### Layout rules
- **4-pt grid** throughout. `16px` screen gutter on a 390pt iPhone canvas.
- **Top safe area: 47pt** (Dynamic Island), **bottom safe area: 34pt** (home indicator).
- Top bar height: `44pt` + safe area.
- Bottom tab bar: `49pt` + safe area.
- Lists: `44pt` minimum row height (iOS HIG hit target). FAB: `56pt`.
- Dashboard tile default: **full-width** card, vertical stack (no 2-column grids on mobile — Looker mobile docs are explicit).

---

## ICONOGRAPHY

Looker on Google Cloud uses **Google Material Symbols** — the open icon set Google ships across all its products. We pull live from the CDN.

- **System:** [Material Symbols (Rounded)](https://fonts.google.com/icons) at weight 400, fill 0, grade 0, optical size 24. Rounded matches Google Sans + the soft 12pt radii of the system. (Outlined is acceptable for dense secondary surfaces.)
- **Loading:** Google Fonts CDN as a font face — `Material Symbols Rounded`. Icons are rendered as `<span class="material-symbols-rounded">dashboard</span>` etc.
- **Common glyphs** in the Looker mobile context:
  - `dashboard` — dashboard entity
  - `query_stats` / `bar_chart` — Look entity
  - `bookmarks` — board entity
  - `folder` — folder
  - `star` / `star_outline` — favorite
  - `history` — recently viewed
  - `search` — search
  - `more_vert` — three-dot menu
  - `share` — share sheet
  - `notifications` — alerts
  - `arrow_back` — iOS back
  - `tune` — filters
  - `refresh` — reload data
- **Brand mark:** SVG, copied into `assets/looker-app-icon.svg` and `assets/looker-wordmark.svg`.
- **No emoji. No custom illustration SVGs in product chrome.** Charts are rendered through the viz library, not as decorative SVGs.

> **Substitution flag:** Material Symbols is the *real* icon system Google products use. No substitution needed here.

---

## File index

```
README.md                  ← you are here
index.html                 ← GitHub Pages landing (links to UI kit + docs)
SKILL.md                   ← invocable as a Claude Skill
.gitignore
colors_and_type.css        ← all CSS tokens + semantic classes
assets/
  looker-app-icon.svg      ← rounded-square iOS app tile
  looker-wordmark.svg      ← Looker wordmark (light bg)
  looker-wordmark-dark.svg ← Looker wordmark (dark bg)
  looker-lockup.svg        ← icon + wordmark side by side
preview/                   ← Design System tab cards (registered)
ui_kits/
  mobile/                  ← Looker iOS UI kit
    README.md
    index.html             ← interactive prototype
    *.jsx                  ← React components
```

---

## Substitutions flagged

| Asset | Real | Substitute | Why |
| --- | --- | --- | --- |
| Brand font | Google Sans | **Roboto** | Google Sans is proprietary, not redistributable. Roboto is Google's open variant — same foundry, similar metrics. Drop in `Google Sans.woff2` files into `fonts/` to upgrade. |
| Mono font | Google Sans Code | **Roboto Mono** | Same reasoning. |
| Wordmark / app icon | Official `Looker.app` art | **Custom SVG recreation** | Official art is in the iOS bundle's `Assets.car`. Recreations are typographic + simple geometry to match the public app icon. Replace with official `.svg`/`.pdf` when available. |

---

## How to iterate

Open the **Design System** tab to see all foundation cards. Open `ui_kits/mobile/index.html` for the interactive UI kit prototype. Click around — every screen is wired up.

When you're ready to push fidelity:
1. Push real iOS code (Swift or React Native) to `contactkram/lookermobile` and re-invoke this skill.
2. Or attach Figma frames / screenshots and call out which screens to mirror.
3. Or drop the official `.woff2` for Google Sans into `fonts/` — I'll wire it up.
