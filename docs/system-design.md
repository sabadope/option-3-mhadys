# Nimbus OS — System Design (Visual Design System)

**Version:** 1.0  
**Scope:** Design tokens, visual language, styling conventions — portable across applications

---

## 1. Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Dark-First** | Native dark mode only; no light theme. Reduces eye strain for long admin sessions. |
| **Liquid Glass** | Layered translucency with backdrop blur; creates depth without heavy shadows. |
| **Module-Aware** | Three domains (Events, Commerce, Auto Care) each with a semantic accent color that permeates UI. |
| **Motion as Meaning** | Spring-based animations (cubic-bezier 0.32, 0.72, 0, 1) convey state changes, not decoration. |
| **Data Density** | High information density with clear hierarchy; optimized for dashboard/scanning workflows. |
| **Accessibility First** | WCAG AA contrast, focus-visible rings, reduced-motion support, semantic HTML. |

**Visual Identity:** Clinical precision, calm authority, premium feel — inspired by macOS/visionOS glass, Linear, Vercel, Raycast.

---

## 2. Color System (OKLCH Color Space)

All colors in **OKLCH** for perceptual uniformity.

### 2.1 Base Palette (`:root`)

```css
:root {
  --radius: 0.875rem; /* 14px base */

  /* Core surfaces */
  --background:    oklch(0.125 0.006 265);  /* Near-black blue */
  --foreground:    oklch(0.955 0.004 260);  /* Soft white */
  --card:          oklch(0.165 0.006 265);  /* Elevated surface */
  --card-foreground: oklch(0.955 0.004 260);
  --surface:       oklch(0.165 0.006 265);  /* Primary content bg */
  --surface-2:     oklch(0.205 0.007 265);  /* Subtle elevation */
  --popover:       oklch(0.185 0.007 265);  /* Overlays */

  /* Interactive */
  --primary:       oklch(0.955 0.004 260);  /* White — primary actions */
  --primary-foreground: oklch(0.14 0.006 265);
  --secondary:     oklch(0.225 0.007 265);  /* Secondary actions */
  --secondary-foreground: oklch(0.93 0.004 260);
  --muted:         oklch(0.205 0.007 265);
  --muted-foreground: oklch(0.64 0.01 260);  /* Secondary text */
  --accent:        oklch(0.235 0.008 265);  /* Hover/focus */
  --accent-foreground: oklch(0.955 0.004 260);

  /* Semantic */
  --destructive:   oklch(0.66 0.2 22);      /* Errors/danger */
  --destructive-foreground: oklch(0.98 0 0);
  --success:       oklch(0.74 0.15 160);    /* Success states */
  --warning:       oklch(0.8 0.14 80);      /* Warnings */
  --info:          oklch(0.72 0.13 240);    /* Info states */

  /* Borders */
  --border:        oklch(1 0 0 / 8%);
  --border-strong: oklch(1 0 0 / 14%);
  --input:         oklch(1 0 0 / 10%);
  --ring:          oklch(0.75 0.02 260);    /* Focus rings */

  /* Charts (neutral defaults) */
  --chart-1: oklch(0.9 0.005 260);
  --chart-2: oklch(0.6 0.02 260);
  --chart-3: oklch(0.45 0.015 260);
  --chart-4: oklch(0.8 0.12 80);
  --chart-5: oklch(0.72 0.13 240);

  /* Sidebar */
  --sidebar: oklch(0.14 0.006 265);
  --sidebar-foreground: oklch(0.955 0.004 260);
  --sidebar-primary: var(--module);
  --sidebar-primary-foreground: var(--module-foreground);
  --sidebar-accent: oklch(1 0 0 / 6%);
  --sidebar-accent-foreground: oklch(0.955 0.004 260);
  --sidebar-border: oklch(1 0 0 / 8%);
  --sidebar-ring: var(--ring);

  /* Neutral module (overview) */
  --module: oklch(0.9 0.005 260);
  --module-foreground: oklch(0.14 0.006 265);
  --module-soft: oklch(0.9 0.005 260 / 10%);
}
```

### 2.2 Module Accents (Contextual Theming)

Applied via `[data-module="event|commerce|autocare"]` on root wrapper.

| Module | Token | OKLCH | Hex | Personality |
|--------|-------|-------|-----|-------------|
| **Events** | `--event` | `oklch(0.68 0.17 278)` | `#9B59E6` | Purple — creative, premium |
| **Commerce** | `--commerce` | `oklch(0.82 0.07 72)` | `#F5D04D` | Gold/amber — revenue, growth |
| **Auto Care** | `--autocare` | `oklch(0.74 0.14 162)` | `#33C47E` | Green — operational, trust |

**Derived tokens (auto-switched per module):**
```css
[data-module="event"] {
  --module: var(--event);
  --module-foreground: oklch(0.98 0 0);
  --module-soft: oklch(0.68 0.17 278 / 14%);
  --chart-1: var(--event);
  --chart-2: oklch(0.55 0.12 290);
}
[data-module="commerce"] {
  --module: var(--commerce);
  --module-foreground: oklch(0.16 0.02 70);
  --module-soft: oklch(0.82 0.07 72 / 13%);
  --chart-1: var(--commerce);
  --chart-2: oklch(0.6 0.03 70);
}
[data-module="autocare"] {
  --module: var(--autocare);
  --module-foreground: oklch(0.14 0.03 160);
  --module-soft: oklch(0.74 0.14 162 / 13%);
  --chart-1: var(--autocare);
  --chart-2: oklch(0.55 0.08 165);
}
```

### 2.3 Semantic Status → Tone Mapping

Used by badges, payment panels, charts:

| Status Group | Tone | Visual |
|--------------|------|--------|
| `active`, `published`, `completed`, `delivered`, `paid`, `healthy`, `available`, `checked_in` | **success** | Green |
| `pending`, `confirmed`, `arrived`, `in_queue`, `low`, `partial`, `processing`, `packed`, `shipped`, `quality_check`, `busy`, `maintenance` | **warning** / **info** / **module** | Amber/Blue/Module |
| `cancelled`, `out_of_stock`, `out`, `unpaid`, `refunded` | **danger** / **neutral** | Red/Gray |
| `draft`, `inactive`, `booked`, `off` | **neutral** | Gray |

**Tone CSS Classes:**
```css
neutral:  bg-secondary text-muted-foreground
info:     bg-info/12 text-info
success:  bg-success/12 text-success
warning:  bg-warning/14 text-warning
danger:   bg-destructive/14 text-destructive
module:   bg-module-soft text-module
```

---

## 3. Typography

### 3.1 Font Stack

```css
--font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;
```

**Features:** `"ss01"`, `"cv11"` (stylistic alternates), `"tnum" 0` (proportional nums default)

### 3.2 Type Scale

| Role | Size | Weight | Line Ht | Letter Spacing | Usage |
|------|------|--------|---------|----------------|-------|
| **Display** | 48px / 3rem | 600 | 1.1 | -0.02em | Marketing, empty states |
| **H1 / Page Title** | 30px (sm: 36px) | 600 | 1.2 | -0.01em | `PageHeader` title |
| **H2 / Section** | 20px (sm: 24px) | 600 | 1.3 | -0.01em | `SectionCard` title |
| **H3 / Subsection** | 15px | 600 | 1.4 | 0 | MetricCard values (lg) |
| **Body Large** | 15px | 400 | 1.6 | 0 | Descriptions |
| **Body** | 14px | 400 | 1.5 | 0 | Default UI text |
| **Body Small** | 13px | 400 | 1.5 | 0 | Form labels, hints |
| **Caption / Eyebrow** | 11px | 600 | 1.4 | **0.14em** | Uppercase labels |
| **Micro** | 10px | 500 | 1.3 | 0 | Timeline dots, chips |
| **Tabular Numbers** | Contextual | 500-600 | 1 | **tabular-nums** | Prices, metrics, counts |

### 3.3 Utility Classes

```css
@utility eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-muted-foreground);
}
@utility tabular { font-variant-numeric: tabular-nums; }
@utility text-balance { text-wrap: balance; }
```

### 3.4 Rendering

```css
html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body { font-family: var(--font-sans); font-feature-settings: "ss01", "cv11", "tnum" 0; }
::selection { background: color-mix(in oklab, var(--module) 35%, transparent); }
```

---

## 4. Spacing & Layout Tokens

### 4.1 Base Unit
- **4px (0.25rem)** — all spacing multiples of 4px via Tailwind scale

### 4.2 Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 10px | Small elements |
| `--radius-md` | 12px | Default inputs |
| `--radius-lg` | 14px | **Base** — buttons, cards |
| `--radius-xl` | 18px | Larger panels |
| `--radius-2xl` | 22px | **Primary** — `GlassPanel`, `MetricCard` |
| `--radius-3xl` | 26px | Sheets, drawers |
| `--radius-4xl` | 30px | Full-screen modals |

### 4.3 Container & Layout

- **Max content width:** `max-w-7xl` (1280px)
- **Sidebar:** `w-64` (256px) collapsed → `w-80` (320px) expanded
- **Content padding:** `px-4 sm:px-6 lg:px-8`
- **Section gap:** `space-y-6` (24px)

---

## 5. Materials & Surfaces

Three-tier depth system:

### 5.1 Material Definitions

```css
/* LIQUID GLASS — Floating nav, overlays, contextual controls */
@utility glass {
  background: color-mix(in oklab, oklch(0.2 0.006 265) 58%, transparent);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid oklch(1 0 0 / 9%);
  box-shadow: var(--shadow-glass);
}
@utility glass-strong {
  background: color-mix(in oklab, oklch(0.19 0.006 265) 82%, transparent);
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid oklch(1 0 0 / 11%);
  box-shadow: var(--shadow-elevated);
}
@utility glass-highlight {
  position: relative;
  &::before {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, oklch(1 0 0 / 7%) 0%, transparent 28%);
  }
}

/* SOLID SURFACE — Primary content, forms, tables */
@utility surface {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
}
@utility surface-2 {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}

/* MODULE ATMOSPHERE — Page header gradients */
@utility module-atmosphere {
  background:
    radial-gradient(900px 380px at 12% -10%, color-mix(in oklab, var(--module) 18%, transparent), transparent 60%),
    radial-gradient(600px 300px at 90% 0%, color-mix(in oklab, var(--module) 8%, transparent), transparent 60%);
}
```

### 5.2 Shadows

```css
--shadow-glass:      inset 0 1px 0 0 oklch(1 0 0 / 9%), 0 12px 40px -12px oklch(0 0 0 / 55%);
--shadow-elevated:   0 1px 0 0 oklch(1 0 0 / 4%) inset, 0 24px 60px -20px oklch(0 0 0 / 70%);
--shadow-soft:       0 1px 2px oklch(0 0 0 / 30%), 0 8px 24px -12px oklch(0 0 0 / 45%);
```

### 5.3 Material Usage Rules

| Material | Use For | Avoid For |
|----------|---------|-----------|
| `glass` | Top bar, floating panels, command palette, tooltips | Long-form content, forms, data tables |
| `glass-strong` | Sheets, drawers, dialogs, mobile bottom sheets | Primary reading surfaces |
| `surface` | Cards, tables, forms, primary content panels | Floating/transient UI |
| `surface-2` | Nested cards, input backgrounds, hover states | Top-level containers |
| `module-atmosphere` | Page headers (optional), hero sections | General purpose |

---

## 6. Motion & Animation

### 6.1 Easing & Timing

```css
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
```

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button press | 150ms | spring |
| Hover transitions | 200ms | spring |
| Page/header rise | 350ms | spring |
| Card/row enter | 180ms | ease-out |
| Sheet/drawer | 250ms | spring |
| Tooltip/popover | 150ms | spring |
| Skeleton shimmer | 1.6s | linear (∞) |

### 6.2 Keyframes

```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@utility animate-shimmer { animation: var(--animate-shimmer); }
@utility animate-rise    { animation: var(--animate-rise); }
```

### 6.3 Motion Primitives (Framer Motion)

- **Page enter:** `initial={{opacity:0, y:6}}` → `animate={{opacity:1, y:0}}` (0.35s spring)
- **List FLIP:** `layout` prop on rows for filter/sort transitions
- **Stagger:** `delay: i * 0.05` for ranked bars, metric cards
- **Press:** `@utility press` → `transition: transform 0.15s spring, opacity 0.15s; active: scale(0.97)`

### 6.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Component Visual Specifications

### 7.1 Button Variants

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| `default` | `--primary` | `--primary-foreground` | — | `bg-primary/90` |
| `module` | `--module` | `--module-foreground` | — | `brightness-110` |
| `destructive` | `--destructive` | `--destructive-foreground` | — | `bg-destructive/90` |
| `outline` | transparent | `--foreground` | `--border-strong` | `bg-accent` |
| `secondary` | `--secondary` | `--secondary-foreground` | — | `bg-accent` |
| `glass` | `glass` utility | `--foreground` | `glass` border | `bg-accent/60` |
| `ghost` | transparent | `--foreground` | — | `bg-accent` |
| `subtle` | `--module-soft` | `--module` | — | `bg-module/20` |
| `link` | transparent | `--primary` | — | `underline` |

**Sizes:** `sm` (32px), `default` (40px), `lg` (48px), `xl` (56px), `icon` (40×40), `icon-sm` (32×32)

**Base styles:** `rounded-full`, `font-medium`, `transition-[background-color,color,transform,opacity] duration-200 ease-[var(--ease-spring)]`, `active:scale-[0.97]`, `focus-visible:ring-2 ring-ring/60 ring-offset-2`

### 7.2 Input Fields

```css
h-11 rounded-xl border-border-strong bg-surface-2 px-3.5 text-[15px] md:text-sm
placeholder: text-muted-foreground/50
focus-visible: ring-2 ring-ring ring-offset-2 ring-offset-background
```

### 7.3 Cards

- **Base:** `rounded-xl border bg-card text-card-foreground shadow`
- **Header:** `p-6 space-y-1.5`
- **Title:** `font-semibold leading-none tracking-tight`
- **Description:** `text-sm text-muted-foreground`
- **Content:** `p-6 pt-0`
- **Footer:** `flex items-center p-6 pt-0`

### 7.4 Badges (StatusBadge)

```css
inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold tracking-wide
/* + tone class from 2.3 */
```

### 7.5 Skeletons

```css
@utility skeleton {
  background: linear-gradient(90deg, oklch(1 0 0 / 4%) 25%, oklch(1 0 0 / 9%) 50%, oklch(1 0 0 / 4%) 75%);
  background-size: 200% 100%;
  animation: var(--animate-shimmer);
  border-radius: var(--radius-md);
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| **Base** | < 640px | Mobile-first, single column, bottom sheets |
| **sm** | 640px | Tablet portrait, 2-col metric grid |
| **md** | 768px | Tablet landscape, tables visible |
| **lg** | 1024px | Desktop, sidebar expanded, 4-col grid |
| **xl** | 1280px | Wide, max container |
| **2xl** | 1536px | Ultra-wide |

**Table Strategy:** Desktop (≥md) = full `<table>` with horizontal scroll; Mobile (<md) = card stack

---

## 9. Accessibility Standards

- [x] **Contrast:** All text ≥ 4.5:1 (AA), large text ≥ 3:1
- [x] **Focus Visible:** Custom rings on all interactive elements (`ring-2 ring-ring/60 ring-offset-2`)
- [x] **Keyboard:** Logical Tab order, Enter/Space activate, Escape closes dialogs
- [x] **ARIA:** Labels, expanded/controls, radiogroup, dialog roles
- [x] **Reduced Motion:** Media query disables all animations
- [x] **Semantic HTML:** header, main, section, nav, button, table
- [x] **Live Regions:** `aria-live="polite"` for toasts, `aria-busy` for skeletons
- [x] **Selection:** `::selection` uses module color at 35% opacity

---

## 10. Theming & Customization

### 10.1 Adding a Module

```css
--newmodule: oklch(0.7 0.15 300);
[data-module="newmodule"] {
  --module: var(--newmodule);
  --module-foreground: oklch(0.98 0 0);
  --module-soft: oklch(0.7 0.15 300 / 14%);
  --chart-1: var(--newmodule);
  --chart-2: oklch(0.55 0.1 310);
}
```

### 10.2 Radius Override

```css
:root { --radius: 1rem; }  /* Scales all radius tokens */
```

### 10.3 Font Swap

```css
@theme inline {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

---

## 11. Color Usage Rules

| Do | Don't |
|----|-------|
| Use `--module`, `--module-soft`, `--module-foreground` for module UI | Hardcode hex/OKLCH |
| Use `--success`, `--warning`, `--destructive` for semantic states | Use `green-500`, `red-500` |
| Use `--border`, `--border-strong` for borders | Use `border-gray-700` |
| Use `color-mix(in oklab, ...)` for transparencies | Use `opacity-50` on colored backgrounds |

---

## 12. File Reference (Design Tokens Only)

```
src/
├── styles.css              # Complete design tokens + @utility classes
├── lib/
│   ├── format.ts           # peso, date, initials, humanize
│   └── status.ts           # toneFor(status) → Tone mapping
```