# Nimbus OS — System Design Specification

**Version:** 1.0  
**Last Updated:** 2026-10-03  
**Platform:** Web (React 19, TanStack Start, Tailwind CSS v4)  
**Design Language:** Dark-first, Apple-inspired, Liquid Glass materials

---

## 1. Design Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| **Dark-First** | Native dark mode only; no light theme. Reduces eye strain for long admin sessions. |
| **Liquid Glass** | Layered translucency with backdrop blur; creates depth without heavy shadows. |
| **Module-Aware** | Three domains (Events, Commerce, Auto Care) each with a semantic accent color that permeates UI. |
| **Motion as Meaning** | Spring-based animations (cubic-bezier 0.32, 0.72, 0, 1) convey state changes, not decoration. |
| **Data Density** | High information density with clear hierarchy; optimized for dashboard/scanning workflows. |
| **Accessibility First** | WCAG AA contrast, focus-visible rings, reduced-motion support, semantic HTML. |

### 1.2 Visual Identity

- **Brand Name:** Nimbus OS
- **Metaphor:** "Operating system for business operations" — modular, extensible, professional
- **Tone:** Clinical precision, calm authority, premium feel
- **Inspiration:** macOS/visionOS glass materials, Linear, Vercel, Raycast

---

## 2. Color System (OKLCH Color Space)

All colors defined in **OKLCH** (perceptually uniform) for consistent lightness/chroma across hues.

### 2.1 Base Palette (Root — `:root`)

```css
:root {
  --radius: 0.875rem; /* 14px base radius */

  /* Core surfaces */
  --background:    oklch(0.125 0.006 265);  /* #1A1A2E — near-black blue */
  --foreground:    oklch(0.955 0.004 260);  /* #F2F2F3 — soft white */
  --card:          oklch(0.165 0.006 265);  /* #24243E — elevated surface */
  --card-foreground: oklch(0.955 0.004 260);
  --surface:       oklch(0.165 0.006 265);  /* Primary content background */
  --surface-2:     oklch(0.205 0.007 265);  /* #2E2E4A — subtle elevation */
  --popover:       oklch(0.185 0.007 265);  /* #292944 — overlays */

  /* Interactive */
  --primary:       oklch(0.955 0.004 260);  /* White — primary actions */
  --primary-foreground: oklch(0.14 0.006 265);
  --secondary:     oklch(0.225 0.007 265);  /* #2E2E4A — secondary actions */
  --secondary-foreground: oklch(0.93 0.004 260);
  --muted:         oklch(0.205 0.007 265);
  --muted-foreground: oklch(0.64 0.01 260);  /* #8A8A9E — secondary text */
  --accent:        oklch(0.235 0.008 265);  /* Hover/focus states */
  --accent-foreground: oklch(0.955 0.004 260);

  /* Semantic */
  --destructive:   oklch(0.66 0.2 22);      /* #E84D4D — errors/danger */
  --destructive-foreground: oklch(0.98 0 0);
  --success:       oklch(0.74 0.15 160);    /* #2EC47A — success states */
  --warning:       oklch(0.8 0.14 80);      /* #F2C94C — warnings */
  --info:          oklch(0.72 0.13 240);    /* #4A9EFF — info states */

  /* Borders */
  --border:        oklch(1 0 0 / 8%);       /* Subtle hairlines */
  --border-strong: oklch(1 0 0 / 14%);      /* Visible boundaries */
  --input:         oklch(1 0 0 / 10%);      /* Input backgrounds */
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
}
```

### 2.2 Module Accents (Contextual Theming)

Applied via `[data-module="event|commerce|autocare"]` on a parent wrapper (e.g., `<body>` or app shell).

| Module | CSS Variable | OKLCH Value | Hex Approx | Usage |
|--------|-------------|-------------|------------|-------|
| **Events** | `--event` | `oklch(0.68 0.17 278)` | `#9B59E6` | Purple — creative, premium |
| **Commerce** | `--commerce` | `oklch(0.82 0.07 72)` | `#F5D04D` | Gold/amber — revenue, growth |
| **Auto Care** | `--autocare` | `oklch(0.74 0.14 162)` | `#33C47E` | Green — operational, trust |

**Derived module tokens (auto-switched):**
```css
[data-module="event"] {
  --module: var(--event);
  --module-foreground: oklch(0.98 0 0);           /* White text on purple */
  --module-soft: oklch(0.68 0.17 278 / 14%);      /* Subtle backgrounds */
  --chart-1: var(--event);
  --chart-2: oklch(0.55 0.12 290);
}

[data-module="commerce"] {
  --module: var(--commerce);
  --module-foreground: oklch(0.16 0.02 70);       /* Dark text on gold */
  --module-soft: oklch(0.82 0.07 72 / 13%);
  --chart-1: var(--commerce);
  --chart-2: oklch(0.6 0.03 70);
}

[data-module="autocare"] {
  --module: var(--autocare);
  --module-foreground: oklch(0.14 0.03 160);      /* Dark text on green */
  --module-soft: oklch(0.74 0.14 162 / 13%);
  --chart-1: var(--autocare);
  --chart-2: oklch(0.55 0.08 165);
}
```

**Neutral/Overview module** (no `data-module` or `data-module="overview"`):
```css
--module: oklch(0.9 0.005 260);       /* Near-white */
--module-foreground: oklch(0.14 0.006 265);
--module-soft: oklch(0.9 0.005 260 / 10%);
```

### 2.3 Semantic Color Mapping (Status → Tone)

Used by `StatusBadge` and `PaymentPanel` via `lib/status.ts`:

| Status | Tone | Visual |
|--------|------|--------|
| `active`, `published`, `completed`, `delivered`, `paid`, `healthy`, `available`, `checked_in` | **success** | Green badge |
| `pending`, `confirmed`, `arrived`, `in_queue`, `low`, `partial`, `processing`, `packed`, `shipped`, `quality_check`, `busy`, `maintenance` | **warning** / **info** / **module** | Amber/Blue/Module badge |
| `cancelled`, `out_of_stock`, `out`, `unpaid`, `refunded` | **danger** / **neutral** | Red/Gray badge |
| `draft`, `inactive`, `booked`, `off` | **neutral** | Gray badge |

---

## 3. Typography

### 3.1 Font Stack

```css
--font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;
```

- **Geist** (Vercel's font) — geometric, highly legible, variable weight
- **Geist Mono** — tabular numerals, code, IDs, amounts
- **Font Features:** `"ss01"`, `"cv11"` (stylistic alternates), `"tnum" 0` (proportional nums by default)

### 3.2 Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| **Display** | 48px / 3rem | 600 | 1.1 | -0.02em | Marketing, empty states |
| **H1 / Page Title** | 30px / 1.875rem (sm: 36px) | 600 | 1.2 | -0.01em | `PageHeader` title |
| **H2 / Section Title** | 20px / 1.25rem (sm: 24px) | 600 | 1.3 | -0.01em | `SectionCard` title, Card headers |
| **H3 / Subsection** | 15px / 0.9375rem | 600 | 1.4 | 0 | MetricCard values (lg), Table headers |
| **Body Large** | 15px / 0.9375rem | 400 | 1.6 | 0 | Descriptions, paragraph text |
| **Body** | 14px / 0.875rem | 400 | 1.5 | 0 | Default UI text |
| **Body Small** | 13px / 0.8125rem | 400 | 1.5 | 0 | Form labels, hints |
| **Caption / Eyebrow** | 11px / 0.6875rem | 600 | 1.4 | **0.14em** | Uppercase labels, categories |
| **Micro** | 10px / 0.625rem | 500 | 1.3 | 0 | Timeline dots, chip text |
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

@utility tabular {
  font-variant-numeric: tabular-nums;
}

@utility text-balance {
  text-wrap: balance;
}
```

### 3.4 Text Rendering

```css
html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11", "tnum" 0;
}
```

---

## 4. Spacing & Layout

### 4.1 Base Unit

- **4px** (0.25rem) — all spacing multiples of 4px
- Tailwind's spacing scale used directly: `p-4` = 16px, `gap-6` = 24px, etc.

### 4.2 Layout Grid

- **Container max-width:** `max-w-7xl` (1280px) for main content
- **Sidebar width:** `w-64` (256px) collapsed → `w-80` (320px) expanded
- **Content padding:** `px-4 sm:px-6 lg:px-8` (responsive)
- **Section gap:** `space-y-6` (24px) between major sections

### 4.3 Border Radius Scale

```css
--radius-sm:  calc(var(--radius) - 4px);  /* 10px */
--radius-md:  calc(var(--radius) - 2px);  /* 12px */
--radius-lg:  var(--radius);               /* 14px — default */
--radius-xl:  calc(var(--radius) + 4px);   /* 18px */
--radius-2xl: calc(var(--radius) + 8px);   /* 22px — cards, panels */
--radius-3xl: calc(var(--radius) + 12px);  /* 26px */
--radius-4xl: calc(var(--radius) + 16px);  /* 30px — sheets, dialogs */
```

**Usage:**
- `rounded-full` — badges, pills, avatars, buttons
- `rounded-xl` (16px) — standard cards
- `rounded-2xl` (22px) — primary panels (`GlassPanel`, `MetricCard`)
- `rounded-3xl` (26px) — sheets, drawers
- `rounded-4xl` (30px) — full-screen modals

---

## 5. Materials & Surfaces

Three material tiers create depth hierarchy:

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

/* Top-edge highlight (specular reflection) */
@utility glass-highlight {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, oklch(1 0 0 / 7%) 0%, transparent 28%);
  }
}

/* SOLID SURFACE — Primary content areas, forms, tables */
@utility surface {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
}

@utility surface-2 {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}
```

### 5.2 Shadow System

```css
--shadow-glass:      inset 0 1px 0 0 oklch(1 0 0 / 9%), 0 12px 40px -12px oklch(0 0 0 / 55%);
--shadow-elevated:   0 1px 0 0 oklch(1 0 0 / 4%) inset, 0 24px 60px -20px oklch(0 0 0 / 70%);
--shadow-soft:       0 1px 2px oklch(0 0 0 / 30%), 0 8px 24px -12px oklch(0 0 0 / 45%);
```

### 5.3 Material Usage Rules

| Material | Use For | Not For |
|----------|---------|---------|
| `glass` | Top bar, floating panels, command palette, tooltips | Long-form content, forms, data tables |
| `glass-strong` | Sheets, drawers, dialogs, mobile bottom sheets | Primary reading surfaces |
| `surface` | Cards, tables, forms, primary content panels | Floating/transient UI |
| `surface-2` | Nested cards, input backgrounds, hover states | Top-level containers |
| `module-atmosphere` | Page headers (optional), hero sections | General purpose |

---

## 6. Component System

### 6.1 Architecture

```
src/components/
├── ui/           # Primitive Radix-based components (39 components)
├── kit/          # Composed, opinionated components (12 components)
├── shell/        # App shell: Sidebar, TopBar, AppShell, ModuleSwitcher
├── events/       # Domain-specific: EventCard, AttendeeTable, QRCodeCheckIn...
├── commerce/     # Domain-specific: ProductCard, Cart, OrderTimeline...
└── autocare/     # Domain-specific: BayCard, WorkOrderCard, ResourceScheduler...
```

### 6.2 Primitive Components (`ui/`)

All built on **Radix UI** primitives with `class-variance-authority` (CVA) variants.

#### Button (`ui/button.tsx`)

```tsx
// Variants
default     → bg-primary text-primary-foreground (white on dark)
module      → bg-module text-module-foreground (module color)
destructive → bg-destructive
outline     → border border-border-strong, transparent bg
secondary   → bg-secondary
glass       → glass material
ghost       → transparent, hover:bg-accent
subtle      → bg-module-soft text-module
link        → text-primary underline

// Sizes
default: h-10 px-5 (40px)
sm:      h-8 px-3.5 (32px)
lg:      h-12 px-7 (48px)
xl:      h-14 px-8 (56px)
icon:    h-10 w-10
icon-sm: h-8 w-8

// Motion
transition: background-color, color, transform, opacity — 200ms spring
active: scale(0.97)
focus-visible: ring-2 ring-ring/60 ring-offset-2
```

#### Card (`ui/card.tsx`)

- `Card` — `rounded-xl border bg-card text-card-foreground shadow`
- `CardHeader` — `p-6`, `space-y-1.5`
- `CardTitle` — `font-semibold leading-none tracking-tight`
- `CardDescription` — `text-sm text-muted-foreground`
- `CardContent` — `p-6 pt-0`
- `CardFooter` — `flex items-center p-6 pt-0`

#### Input (`ui/input.tsx`)

```css
h-11 rounded-xl border-border-strong bg-surface-2 px-3.5 text-[15px] md:text-sm
focus-visible: ring-2 ring-ring ring-offset-2 ring-offset-background
placeholder: text-muted-foreground/50
```

#### Other Primitives

All 39 components follow consistent patterns:
- **Radix Primitive** + **Tailwind** + **CVA variants** + **`cn()` utility**
- **Forwarded refs**, **TypeScript props**, **`displayName`**
- **Focus-visible rings** using `--ring` token
- **Dark-mode only** (no light variants)

### 6.3 Kit Components (`kit/`) — Composed Patterns

#### GlassPanel (`kit/GlassPanel.tsx`)

```tsx
type Material = "glass" | "glass-strong" | "surface" | "surface-2" | "minimal";

<GlassPanel material="surface" padded={true}>
  {/* Content */}
</GlassPanel>

// SectionCard — titled panel with optional action
<SectionCard title="Revenue" eyebrow="MTD" action={<Button>Export</Button>}>
  <MetricCard ... />
</SectionCard>
```

#### MetricCard (`kit/MetricCard.tsx`)

```tsx
<MetricCard
  label="Total Revenue"
  value="₱1.2M"
  delta={12.5}           // % change
  hint="vs last month"
  icon={<DollarSign />}
  size="md" | "lg"
  visual={<Sparkline />} // optional right-side viz
/>
```

- **Motion:** `initial={{opacity:0, y:8}}` → `animate={{opacity:1, y:0}}` spring
- **Tabular numerals** for values
- **Delta badge** with arrow icon (green up / red down)

#### StatusBadge (`kit/StatusBadge.tsx`)

```tsx
<StatusBadge status="confirmed" />           // auto-tone via toneFor()
<StatusBadge status="custom" tone="success" />
<StatusBadge status="pending" dot={false} label="Awaiting" />
```

**Tone Classes:**
```css
neutral: bg-secondary text-muted-foreground
info:    bg-info/12 text-info
success: bg-success/12 text-success
warning: bg-warning/14 text-warning
danger:  bg-destructive/14 text-destructive
module:  bg-module-soft text-module
```

#### PageHeader (`kit/PageHeader.tsx`)

```tsx
<PageHeader
  eyebrow="Events"
  title="All Events"
  description="Manage your event portfolio and track attendance."
  actions={<Button variant="module">Create Event</Button>}
  atmosphere={true}  // adds module-atmosphere gradient
/>
```

- **Motion:** `rise` animation (0.35s spring)
- **Layout:** Grid → flex on sm, actions right-aligned

#### Timeline (`kit/Timeline.tsx`)

```tsx
<Timeline
  steps={[
    { key: "booked", label: "Booked", at: "Sep 12" },
    { key: "confirmed", label: "Confirmed", at: "Sep 13" },
    { key: "completed", label: "Completed" }
  ]}
  currentIndex={1}
/>
```

- **Vertical stepper** with connecting line
- **States:** Done (✓ module), Current (pulsing ring + soft bg), Upcoming (○ border)
- **Horizontal variant:** `ProgressSteps` for compact cards

#### DataTable (`kit/DataTable.tsx`)

Full-featured table with:
- **Search** (debounced, local)
- **Filters** (chip groups, mobile sheet)
- **Desktop:** `<table>` with sticky header, hover rows, keyboard nav
- **Mobile:** Card stack with `renderCard` fallback
- **Motion:** `AnimatePresence` + `layout` animations on filter/sort
- **Empty/Loading/Error** states via `EmptyState`/`TableSkeleton`

#### Avatar (`kit/Avatar.tsx`)

```tsx
<InitialsAvatar name="John Doe" size="md" />  // sm: 28px, md: 36px, lg: 56px
<PersonCell name="John Doe" sub="john@co.com" size="md" />
```

- **Background:** `bg-surface-2 ring-1 ring-border`
- **Initials:** First 2 words, uppercase

#### Charts (`kit/Charts.tsx`)

Built on **Recharts** with glass tooltips:

```tsx
<TrendAreaChart data={data} dataKey="value" xKey="day" height={220} format={peso} />
<SimpleBarChart data={data} dataKey="value" format={peso} />
<Sparkline data={data} dataKey="value" width={96} height={32} />
<RankedBars items={[{label, value, sub}]} format={peso} />
```

- **Gradient fills** using `var(--module)` with opacity stops
- **GlassTooltip** — `glass-strong` material
- **Motion:** Fade-in + staggered bar animations

#### FormField (`kit/FormField.tsx`)

```tsx
<FormField label="Email" htmlFor="email" hint="We'll never share this" error={errors.email}>
  <Input id="email" {...register("email")} />
</FormField>

<FormSection title="Billing" description="Invoice details">
  <FormField ... />
</FormSection>
```

- **Input class:** `h-11 rounded-xl border-border-strong bg-surface-2 px-3.5 text-[15px]`
- **Labels:** `text-[13px] text-foreground/90`, required asterisk in `text-module`

#### ConfirmDialog (`kit/ConfirmDialog.tsx`)

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete Event?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive={true}
  onConfirm={handleDelete}
/>
```

- **Glass-strong** content, `rounded-3xl`

#### PaymentPanel (`kit/PaymentPanel.tsx`)

Reusable across all three modules:
- **Summary rows** (subtotal, discount, tax, total, deposit, balance)
- **Method selector** (Cash/Card/Online) with radio-style buttons
- **CTA** with loading state (`Loader2` spin) and success confirmation
- **Compact mode** for tight spaces

---

## 7. Interaction & Motion

### 7.1 Easing & Timing

```css
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);  /* Primary easing */
```

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button press | 150ms | spring |
| Hover transitions | 200ms | spring |
| Page/header rise | 350ms | spring |
| Card/row enter | 180ms | ease-out |
| Sheet/drawer | 250ms | spring |
| Tooltip/popover | 150ms | spring |
| Skeleton shimmer | 1.6s | linear (infinite) |

### 7.2 Animation Primitives

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

### 7.3 Motion Components (Framer Motion)

- **Page transitions:** `initial={{opacity:0, y:6}}` → `animate={{opacity:1, y:0}}`
- **List animations:** `layout` prop on rows for FLIP transitions
- **Stagger:** `delay: i * 0.05` for ranked bars, metric cards
- **Press utility:** `@utility press` → `active: scale(0.97)`

### 7.4 Reduced Motion

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

## 8. State System

### 8.1 Component States

| State | Visual Treatment |
|-------|------------------|
| **Default** | Base styles |
| **Hover** | `hover:bg-accent/60` (glass), `hover:bg-primary/90` (primary), `hover:bg-module/20` (subtle) |
| **Active/Pressed** | `active:scale-[0.97]` + `bg-primary/80` etc. |
| **Focus-Visible** | `ring-2 ring-ring/60 ring-offset-2 ring-offset-background` |
| **Disabled** | `opacity-50 pointer-events-none cursor-not-allowed` |
| **Loading** | `Loader2 animate-spin` in button, skeleton elsewhere |
| **Error** | `border-destructive`, `text-destructive`, destructive toast |
| **Success** | `text-success`, success toast, checkmark animation |

### 8.2 Data States (via `kit/States.tsx`)

```tsx
// Empty State
<EmptyState
  icon={<Inbox />}
  title="No events yet"
  description="Create your first event to get started."
  action={<Button variant="module">Create Event</Button>}
/>

// Error State
<ErrorState message="Failed to load" onRetry={refetch} />

// Skeletons
<Skeleton className="h-8 w-48" />
<MetricSkeleton />
<TableSkeleton rows={6} />
<PageSkeleton />  // Full page composition
```

### 8.3 Form Validation

- **React Hook Form** + **Zod** schemas
- **Inline errors:** `text-xs text-destructive` below field
- **Field-level:** `aria-invalid`, `aria-describedby` error ID
- **Submit:** Disabled until valid, shows toast on error

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| **Base** | < 640px | Mobile-first, single column, bottom sheets |
| **sm** | 640px | Tablet portrait, 2-col metric grid |
| **md** | 768px | Tablet landscape, table shows |
| **lg** | 1024px | Desktop, sidebar expanded, 4-col metric grid |
| **xl** | 1280px | Wide, max container |
| **2xl** | 1536px | Ultra-wide, optional extra column |

**DataTable Responsive Strategy:**
- **Desktop (≥md):** Full `<table>` with horizontal scroll
- **Mobile (<md):** Card stack with `renderCard` or auto `dl` grid

**Navigation:**
- **Desktop:** Persistent sidebar (`Sidebar`)
- **Mobile:** Bottom nav (`MobileNav`) + hamburger → `Sheet` drawer

---

## 10. Module Architecture

### 10.1 Module Switching

```tsx
// AppShell applies data-module to <html> or root wrapper
<html data-module={currentModule}>  // "event" | "commerce" | "autocare" | null
```

**Effect:** All `--module`, `--module-foreground`, `--module-soft`, `--chart-1/2` tokens update instantly via CSS — no React re-render needed.

### 10.2 Module Colors in Components

```tsx
// Button variant="module" → uses --module
<Button variant="module">Primary Action</Button>

// StatusBadge tone="module" → uses --module-soft / --module
<StatusBadge status="in_progress" tone="module" />

// Charts → stroke="var(--module)", fill="url(#fill-id)" with --module stops
<Area stroke="var(--module)" fill={`url(#fill-${id})`} />
```

### 10.3 Module-Specific Components

| Module | Key Components |
|--------|----------------|
| **Events** | `EventCard`, `TicketCard`, `AttendeeTable`, `QRCodeCheckIn`, `CapacityBar`, `EventCalendar`, `DigitalTicket` |
| **Commerce** | `ProductCard`, `ProductGrid`, `Cart`, `StoreLayout`, `VariantEditor`, `OrderTimeline`, `StockAdjustDialog` |
| **Auto Care** | `BayCard`, `WorkOrderCard`, `ServiceCard`, `VehicleCard`, `StaffCard`, `ResourceScheduler`, `ServiceTimeline`, `VehicleBadge` |

---

## 11. Data & Formatting

### 11.1 Currency (Philippine Peso)

```ts
peso(amount, { compact?: boolean })
// ₱1,234,567
// ₱1.2k (compact)
```

### 11.2 Date/Time

```ts
formatDate(iso, "MMM d")        // "Sep 18"
formatDateLong(iso)             // "Friday, September 18, 2026"
formatTime("14:30")             // "2:30 PM"
formatDateTime(iso)             // "Sep 18, 2:30 PM"
timeAgo(iso)                    // "2 hours ago" (relative to fixed NOW)
```

### 11.3 Utilities

```ts
initials("John Doe")      // "JD"
humanize("snake_case")    // "Snake Case"
minutesToLabel(90)        // "1 hr 30 min"
addMinutes("14:30", 45)   // "15:15"
```

---

## 12. Accessibility Checklist

- [x] **Color Contrast:** All text ≥ 4.5:1 (AA), large text ≥ 3:1
- [x] **Focus Visible:** Custom `focus-visible` rings on all interactive elements
- [x] **Keyboard Nav:** `Tab` order logical, `Enter/Space` activates, `Escape` closes dialogs
- [x] **ARIA:** `aria-label`, `aria-expanded`, `aria-controls`, `role="radiogroup"`, `role="dialog"`
- [x] **Reduced Motion:** `@media (prefers-reduced-motion)` disables all animations
- [x] **Semantic HTML:** `<header>`, `<main>`, `<section>`, `<nav>`, `<button>`, `<table>`
- [x] **Live Regions:** `aria-live="polite"` for toasts (Sonner), `aria-busy` for skeletons
- [x] **Selection:** `::selection` uses module color at 35% opacity

---

## 13. Developer Guidelines

### 13.1 Adding New Components

1. **Primitive?** → `src/components/ui/` (Radix + CVA)
2. **Composed/Pattern?** → `src/components/kit/`
3. **Domain-specific?** → `src/components/{events,commerce,autocare}/`
4. **Always:** Export from barrel file, TypeScript props, `forwardRef`, `displayName`

### 13.2 Styling Conventions

```tsx
// Use cn() for class merging
import { cn } from "@/lib/utils";

// Use design tokens, not arbitrary values
className={cn("rounded-2xl", "bg-surface", "border-border")}

// Use utility classes from styles.css
className="glass surface skeleton press tabular eyebrow"

// Variants via CVA
const variants = cva("base", { variants: { variant: { ... } } })
```

### 13.3 Color Usage Rules

| Do | Don't |
|----|-------|
| Use `--module`, `--module-soft`, `--module-foreground` for module-themed UI | Hardcode hex/OKLCH values |
| Use `--success`, `--warning`, `--destructive` for semantic states | Use `green-500`, `red-500` |
| Use `--border`, `--border-strong` for borders | Use `border-gray-700` |
| Use `color-mix(in oklab, ...)` for transparencies | Use `opacity-50` on colored backgrounds |

### 13.4 Motion Guidelines

- **Default:** Use `transition-[background-color,color,transform,opacity] duration-200 ease-[var(--ease-spring)]`
- **Enter/exit:** Framer Motion `initial/animate/exit` + `AnimatePresence`
- **Lists:** `layout` prop for FLIP animations
- **Avoid:** Layout-thrashing animations (width/height/top/left) — prefer transform/opacity

---

## 14. Theming & Customization

### 14.1 Adding a New Module

1. **Define accent** in `styles.css`:
```css
--newmodule: oklch(0.7 0.15 300);
```

2. **Add data-module rule:**
```css
[data-module="newmodule"] {
  --module: var(--newmodule);
  --module-foreground: oklch(0.98 0 0);
  --module-soft: oklch(0.7 0.15 300 / 14%);
  --chart-1: var(--newmodule);
  --chart-2: oklch(0.55 0.1 310);
}
```

3. **Add to `ModuleId` type** in `src/types/index.ts`
4. **Add to `ModuleSwitcher`** and route config

### 14.2 Overriding Radius

```css
:root { --radius: 1rem; }  /* 16px base → all radius tokens scale */
```

### 14.3 Font Swap

```css
@theme inline {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

---

## 15. Implementation Checklist (for New Apps)

### 15.1 Setup

- [ ] Install dependencies: `tailwindcss@4`, `@tailwindcss/vite`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `motion`, `recharts`, `date-fns`
- [ ] Copy `styles.css` → adapt color values if needed
- [ ] Configure `components.json` for shadcn/ui compatibility
- [ ] Set up `cn()` utility, `format.ts`, `status.ts`

### 15.2 Core Components (Priority Order)

1. [ ] `Button` + variants
2. [ ] `Input`, `Label`, `Textarea`, `Select`
3. [ ] `Card` + `CardHeader/Content/Footer`
4. [ ] `GlassPanel` + `SectionCard`
5. [ ] `MetricCard` + `Stat`
6. [ ] `StatusBadge` + `toneFor`
7. [ ] `PageHeader`
8. [ ] `DataTable` (with search, filters, mobile cards)
9. [ ] `Timeline` + `ProgressSteps`
10. [ ] `Avatar` + `PersonCell`
11. [ ] `Charts` (TrendArea, SimpleBar, Sparkline, RankedBars)
12. [ ] `FormField` + `FormSection`
13. [ ] `ConfirmDialog`
14. [ ] `PaymentPanel`
15. [ ] `States` (Empty, Error, Skeletons)

### 15.3 App Shell

- [ ] `Sidebar` (collapsible, module-aware)
- [ ] `TopBar` (search, notifications, user menu)
- [ ] `ModuleSwitcher` (sets `data-module`)
- [ ] `MobileNav` (bottom tab bar)
- [ ] `AppShell` (composes above, handles routing)

### 15.4 Domain Modules

- [ ] Define types in `types/index.ts`
- [ ] Build domain components in `components/{module}/`
- [ ] Create routes/pages using kit components
- [ ] Wire to data layer (TanStack Query + mock/real API)

---

## 16. File Reference

```
src/
├── styles.css              # Complete design tokens + utilities
├── types/index.ts          # Domain types (ModuleId, Event, Order, WorkOrder...)
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── format.ts           # peso, date, initials, humanize
│   ├── status.ts           # toneFor(status) → Tone
│   └── store.tsx           # Global state (module, user, business)
├── components/
│   ├── ui/                 # 39 primitive components
│   ├── kit/                # 12 composed components
│   ├── shell/              # AppShell, Sidebar, TopBar, ModuleSwitcher
│   ├── events/             # Event-specific components
│   ├── commerce/           # Commerce-specific components
│   └── autocare/           # Auto Care-specific components
├── hooks/                  # useMobile, useSimulatedLoading
├── routes/                 # TanStack Router file-based routes
└── data/                   # Mock data for each module
```

---

## 17. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-10-03 | Initial specification extracted from Nimbus OS codebase |

---

*This document is the single source of truth for the Nimbus OS design system. When porting to other applications, copy `styles.css`, `lib/{utils,format,status}.ts`, and the `kit/` components as a unit — they are designed to work together.*