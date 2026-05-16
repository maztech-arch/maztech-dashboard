# Maztech Garage — Design System

A real-time, multi-dimensional dashboard system for an auto repair shop. Covers **finance, repair jobs, parts inventory, customers, appointments** in one cockpit-style interface.

> **Sources** — This design system was generated from scratch. No external codebase, Figma file, or brand book was provided. All visual/voice decisions are documented below so they can be replaced when real materials arrive.

---

## Index

```
.
├── README.md                          ← you are here
├── SKILL.md                           ← Claude Code skill manifest
├── colors_and_type.css                ← single source of truth for tokens
├── assets/
│   ├── logo-mark.svg                  ← square M mark with gear teeth + cyan spark
│   └── logo-wordmark.svg              ← horizontal lockup
├── preview/                           ← Design System tab cards (~25 cards)
│   ├── color-*.html                   ← brand / accent / surfaces / fg / semantic / charts
│   ├── type-*.html                    ← display / headings / body / mono / Thai
│   ├── spacing-*.html                 ← scale / radii / shadows / backgrounds
│   ├── cmp-*.html                     ← buttons / inputs / badges / kpi / tabs / table / avatar
│   └── brand-*.html                   ← logo / icons / voice
├── Maztech Dashboard.html             ← DEV ENTRY: the UI kit, full 6-screen prototype
│   + Maztech Dashboard.css / .store.jsx / .components.jsx / .modals.jsx /
│     .overview.jsx / .finance.jsx / .repair.jsx / .parts.jsx /
│     .customers.jsx / .appointments.jsx / .app.jsx
└── index.html                         ← DIST ENTRY: self-contained bundled export
```

---

## Two entry points — which file to open?

The project has **two HTML entry points** that render the same app but serve different purposes:

| File | When to use | How it works |
|---|---|---|
| **`Maztech Dashboard.html`** | **Editing / development.** Open this when you're iterating on the dashboard — changes to any `.jsx` file are picked up on reload. | Pulls React 18 + Babel-standalone from unpkg, then loads 10 sibling `.jsx` files via `<script type="text/babel" src="…">`. Each `.jsx` publishes its components to `window` so the next file can use them. |
| **`index.html`** | **Distribution / offline use.** ~2.3 MB self-contained file you can hand to someone, email, or drop on a USB stick. | A built artifact. All assets (CSS, JSX, images, fonts) are base64-gzipped and inlined as `<script type="__bundler/manifest">` blocks, then unpacked into Blob URLs at runtime. Works with zero network. |

**Edits to the `.jsx`/`.css` files only show up in `Maztech Dashboard.html`** — `index.html` is a frozen snapshot. To refresh the bundle, re-run whatever process generated it (or treat it as throwaway and regenerate on demand).

---

## Runtime guard

`Maztech Dashboard.app.jsx` runs a top-level check that every expected component is on `window` before mounting `<App/>`. If a script tag fails to load or one of the `.jsx` files throws before its bottom-of-file `Object.assign(window, {…})`, you'll get a red diagnostic box in `#root` listing exactly what's missing and which file should have provided it — instead of a silent blank pane.

If you add a new `.jsx` file, add its exported names to `REQUIRED_GLOBALS` at the top of `app.jsx`.

---

## Brand at a glance

**Maztech Garage** is a modern auto repair shop. The brand is **industrial-precision** — built to look at home in a workshop, not a sales floor. Think welding sparks, headlight beams, gauges, oil. Dark by default. Numbers are protagonists.

- **Mark** — geometric "M" formed by inverted V's (like lifted bonnets / a chevron) with gear-tooth dots above the apex and a single cyan diagnostic spark at the bottom-right. Always rendered on dark or pure white; never on photos.
- **Wordmark** — `MAZTECH` set in Space Grotesk 700 with a tight-tracked mono subtitle `GARAGE · EST 2024`.

---

## Content fundamentals

**Language** — Thai + English mixed. Thai for nouns the customer would say ("ทะเบียน", "เปลี่ยนน้ำมัน", "ลูกค้า"). English/mono for KPIs, IDs, statuses where the shop owner needs to scan fast ("LIVE", "OVERDUE", "MTD", "TXN-2841").

**Tone**
- **Direct, present-tense, owner-first.** Sentences read like a foreman's status update: *"งานวันนี้: 12 คัน · ค้างจ่าย ฿28,400 · อะไหล่ใกล้หมด 3 รายการ"*.
- **Action-oriented CTAs.** Always verb-first: *"เปิดงานซ่อมใหม่"*, *"แจ้งลูกค้าว่ารถพร้อมรับ"*, *"สั่งซื้อ"*. Never *"คลิกที่นี่"*.
- **No marketing fluff.** Never write *"ยินดีต้อนรับสู่ Maztech! ระบบสุดล้ำที่จะปฏิวัติอู่ของคุณ!"*.

**Casing & punctuation**
- Eyebrows / labels in English are **UPPERCASE + 0.14em–0.18em tracking** (e.g. `FINANCE TREND`, `WORKSHOP FLOOR`, `LIVE`).
- Thai never uses uppercase. Use weight (500/600) for emphasis, not all-caps.
- Money formatted as `฿42,180` (Thai baht symbol, comma thousands, no decimals unless < 100).
- Plate numbers always mono, never bold-Thai (these are codes, not words).
- Job IDs always start with `#MZG-` followed by 4 digits — `#MZG-0824`.

**Pronouns** — Address the user as "คุณ" only in customer-facing copy (notifications, receipts). The dashboard itself uses no pronoun — it's a tool, not a person.

**Emoji** — **Never**. Use semantic icons and status dots.

---

## Visual foundations

### Color
- **Brand: Maztech Amber** — `#FF8A00` (primary), `#FFA01F` (hover), `#E07300` (press). Used sparingly — primary CTAs, the active nav indicator, KPI accents, brand chips, sparkline tops. Amber rarely fills large surfaces — it earns its presence through scarcity + a soft `0 0 24px rgba(255,138,0,0.35)` glow.
- **Accent: Diagnostic Cyan** — `#2BD4F4`. Used for *live* indicators only (LIVE pulses, real-time tickers, sensor readouts, line series #2 in charts). Never decorative.
- **Surfaces** — 5-step slate ramp from `#07090C` (page) → `#1F2A36` (inset/chip). Cards use a subtle gradient `linear-gradient(180deg, rgba(17,24,31,0.95), rgba(12,17,23,0.95))` for a hand-finished feel.
- **Foreground** — 4-step ramp from `#F1F5F9` → `#4B5868`. Primary text is **slightly cool white**, never pure `#FFF` (avoids vibration on amber).
- **Semantic** — green/amber/red/sky — used for status pills only.

### Type
- **Display: Space Grotesk** 500/600/700. Geometric, mechanical, modern. Used for headlines, KPI numbers' eyebrow labels, the wordmark.
- **Sans: IBM Plex Sans** (Latin) + **IBM Plex Sans Thai** for body / UI text. Real Thai fonts matter — never substitute with a Latin sans + Thai webfont fallback.
- **Mono: JetBrains Mono** with `font-feature-settings: "tnum" 1` — every number on the dashboard is mono. Tabular figures make rows align across millions of baht. This is the most important rule.

### Spacing & rhythm
- **4px base scale**, used as `--s-1` through `--s-16`. Cards pad at `s-4`/`s-5`. Section gaps at `s-5`/`s-6`.
- **Layout** — fixed 260px sidebar + fluid main. Topbar 64px, sticky, blurred. Screen padding `28px 32px`.
- **Density** — balanced by default; the Tweaks panel lets the user switch to spacious / dense.

### Corners
- xs `4` · sm `6` · md `10` · lg `14` · xl `20` · 2xl `28` · pill `999`.
- **Buttons = pill.** Cards = lg. Inputs = md. Chips/badges = pill. Sparklines stay flush (no rounding).

### Elevation
- `sm` for subtle separations, `md` (default card), `lg` for modals.
- **Brand-glow** — `0 0 24px rgba(255,138,0,0.35)` — reserved for primary CTAs on hover and the active sidebar indicator. Used as the brand's "press conference lighting".
- Insets — used to indicate pressed state (`bg-3` background + inset highlight).

### Backgrounds
The signature surface is the **workshop grid**: a 32×32 rule grid in `rgba(255,255,255,0.035)` layered under a soft radial ember at the top of the viewport. Never full-bleed photos. Never illustrations. The grid signals *precision tool*; the ember signals *warmth*.

### Animation
- **Easing** — `cubic-bezier(0.22, 1, 0.36, 1)` for almost everything (snappy, decelerating). Spring (`0.34, 1.56, 0.64, 1`) for delight micro-moments.
- **Durations** — 120ms (hovers), 220ms (state changes), 420ms (page entry / counter wind-up).
- **Counters wind up** from 0 on screen mount (cubic ease-out). Sparklines, charts, donuts animate their stroke-dasharray.
- **Live pulses** — `LIVE` pill dot, brand-glow active-nav indicator, sparkline tip dot all pulse at 1.6–1.8s.
- **Hover states** — cards lift `-2px` and gain border `var(--line-3)`. Buttons lift `-1px` + gain glow. Rows tint amber at 4% opacity.
- **Press states** — return to `0` translate + darken to amber-600.
- **Page transitions** — staggered `fade-up` over 420ms (children 60ms apart).

### Borders
- Hairline `--line-1` (rgba(255,255,255,0.06)) for inner separators.
- Default `--line-2` (rgba(255,255,255,0.10)) for cards and inputs.
- Emphasized `--line-3` (rgba(255,255,255,0.16)) for hover and focus rings.
- Focus = 3px outer ring at 18% amber, plus border swap to amber-400.

### Transparency & blur
- The topbar is `rgba(7,9,12,0.6)` + `backdrop-filter: blur(8px)` — content scrolls underneath visibly. The sidebar uses a deeper blur (12px) to anchor it.
- Glassmorphism is **restrained** — never apply blur to a card the user is supposed to read at a glance.

---

## Iconography

- **Inline SVG, Lucide-style** — `stroke-width: 1.75`, `stroke-linecap: round`, `stroke-linejoin: round`, square `viewBox="0 0 24 24"`. Drawn inline (see `Maztech Dashboard.components.jsx → Icon`) so they inherit `currentColor`.
- Default size **18px** for nav, **14px** inside buttons, **22px** for the iconography card.
- **Substitution flag** — these are Lucide-shaped approximations drawn from scratch, not the real Lucide font/sprite. If you want exact Lucide, swap to `lucide-react` or copy the official SVG sprite into `assets/icons/`.
- **No emoji.** Status is communicated with semantic dot colors + an icon.
- **No icon font.** Tree-shaken inline SVG only.

---

## Files for further reading

- `colors_and_type.css` — every color, font, radius, shadow, easing, duration, and grid background lives here. Import this in any new file; never invent a hex.
- `Maztech Dashboard.html` + its sibling JSX files — the UI kit. Read these to understand component conventions (KPI, Panel, Pill, Sidebar, TopBar, Sparkline, charts, bay tiles, calendar cells).
- `preview/*.html` — bite-sized cards showing each token in use. The Design System tab renders them all.

---

## Open questions / caveats

- **Fonts** are loaded from Google Fonts CDN (Space Grotesk, IBM Plex Sans Thai, IBM Plex Sans, JetBrains Mono). No `.ttf`/`.woff2` shipped locally. If the brand requires a custom typeface, drop the files into `fonts/` and update the `@import` block at the top of `colors_and_type.css`.
- **Icons** are hand-rolled Lucide-alikes. Real Lucide swap is one PR.
- **Logo mark** is generated — if you have a designer-made mark, replace `assets/logo-mark.svg` and `assets/logo-wordmark.svg`.
- The dashboard currently surfaces **all 6 screens at one route** (left-nav switches). For production, each becomes its own page.

