# Nimbus OS — Architecture (Technical Structure)

**Version:** 1.0  
**Scope:** Component hierarchy, layout system, data flow, routing, state management — how the application works

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      TanStack Start (SSR/SPA)                   │
├─────────────────────────────────────────────────────────────────┤
│  AppShell (layout root)                                         │
│  ├── Sidebar (desktop navigation)                               │
│  ├── TopBar (search, notifications, user, module switcher)     │
│  ├── MobileNav (bottom tabs on mobile)                          │
│  └── <Outlet /> → Route Components                              │
│       ├── /app/events/*           → Events Module               │
│       ├── /app/commerce/*         → Commerce Module             │
│       └── /app/autocare/*         → Auto Care Module            │
├─────────────────────────────────────────────────────────────────┤
│  Global State (React Context + TanStack Query)                  │
│  ├── ModuleContext       → current module (event/commerce/autocare) │
│  ├── UserContext         → auth user, business, permissions    │
│  └── QueryClient         → server state, caching, mutations    │
└─────────────────────────────────────────────────────────────────┘
```

**Tech Stack:**
- **Framework:** TanStack Start (React 19, file-based routing, SSR)
- **Styling:** Tailwind CSS v4 + OKLCH design tokens
- **UI Primitives:** Radix UI (39 components)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **State:** TanStack Query (server), React Context (client)
- **Routing:** TanStack Router (type-safe)

---

## 2. Project Structure

```
src/
├── components/
│   ├── ui/                    # 39 primitive Radix-based components
│   ├── kit/                   # 12 composed, opinionated components
│   ├── shell/                 # App shell: Sidebar, TopBar, AppShell, ModuleSwitcher
│   ├── events/                # Domain-specific (EventCard, AttendeeTable, QRCodeCheckIn...)
│   ├── commerce/              # Domain-specific (ProductCard, Cart, OrderTimeline...)
│   └── autocare/              # Domain-specific (BayCard, WorkOrderCard, ResourceScheduler...)
├── hooks/                     # useMobile, useSimulatedLoading
├── lib/
│   ├── utils.ts               # cn() class merger
│   ├── format.ts              # peso, date, initials, humanize
│   ├── status.ts              # toneFor(status) → Tone
│   └── store.tsx              # Global React Context (module, user, business)
├── routes/                    # TanStack Router file-based routes
│   ├── app.tsx                # AppShell wrapper + outlet
│   ├── app.events.*           # Events routes
│   ├── app.commerce.*         # Commerce routes
│   └── app.autocare.*         # Auto Care routes
├── data/                      # Mock data per module (customers, events, products...)
├── types/index.ts             # Domain types (ModuleId, Event, Order, WorkOrder...)
├── styles.css                 # Design tokens (see system-design.md)
└── start.ts                   # App entry
```

---

## 3. Component Hierarchy

### 3.1 Layer Definitions

| Layer | Path | Responsibility | Example |
|-------|------|----------------|---------|
| **Primitives** | `components/ui/` | Single Radix primitive + CVA variants, no business logic | `Button`, `Input`, `Dialog`, `Select` |
| **Kit** | `components/kit/` | Composed patterns using primitives + design tokens | `DataTable`, `MetricCard`, `PaymentPanel` |
| **Shell** | `components/shell/` | App-level layout, navigation, module switching | `Sidebar`, `TopBar`, `AppShell` |
| **Domain** | `components/{events,commerce,autocare}/` | Business-specific components | `EventCard`, `ProductCard`, `BayCard` |
| **Routes** | `routes/` | Page composition, data fetching, mutations | `app.events.list.tsx`, `app.commerce.orders.index.tsx` |

### 3.2 Primitive Components (`ui/`) — 39 Total

All follow: **Radix Primitive + Tailwind + CVA + `cn()` + `forwardRef` + TypeScript**

```
Accordion, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button,
Calendar, Card, Carousel, Checkbox, Collapsible, Command, ContextMenu,
Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP,
Label, Menubar, NavigationMenu, Pagination, Popover, Progress,
RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet,
Sidebar, Slider, Sonner (toast), Switch, Table, Tabs, Toggle,
ToggleGroup, Tooltip
```

### 3.3 Kit Components (`kit/`) — 12 Composed Patterns

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `GlassPanel` | Material wrapper | `glass\|glass-strong\|surface\|surface-2\|minimal` + `SectionCard` |
| `MetricCard` | KPI display | Value, delta %, hint, icon, visual (sparkline), spring entrance |
| `StatusBadge` | Status pill | Auto-tone via `toneFor()`, dot indicator, custom label |
| `PageHeader` | Page title block | Eyebrow, title, description, actions, `atmosphere` gradient, rise animation |
| `Timeline` | Vertical stepper | Done (✓), Current (pulse), Upcoming (○), connecting line, horizontal variant |
| `DataTable` | Full-featured table | Search, filters (chips/sheet), desktop table + mobile cards, FLIP animations |
| `Avatar` | User representation | InitialsAvatar (sizes), PersonCell (name + sub) |
| `Charts` | Data viz | TrendArea, SimpleBar, Sparkline, RankedBars — glass tooltips, module colors |
| `FormField` | Form row | Label, hint, error, required asterisk (module color) |
| `FormSection` | Form grouping | `surface` panel, title, description, grid layout |
| `ConfirmDialog` | Deletion/confirmation | `glass-strong`, destructive variant, focus trap |
| `PaymentPanel` | Universal payment | Summary rows, method selector (cash/card/online), CTA, loading, success |

---

## 4. Layout System (App Shell)

### 4.1 AppShell (`components/shell/AppShell.tsx`)

```tsx
// Root layout wrapper
<AppShell>
  <Sidebar />           // Desktop: persistent, collapsible
  <TopBar />            // Search, notifications, user menu, module switcher
  <MobileNav />         // Mobile: bottom tab bar (hidden on desktop)
  <main className="flex-1 overflow-auto">
    <Outlet />          // Route content
  </main>
</AppShell>
```

**Applies `data-module`** to `<html>` based on current module context.

### 4.2 Sidebar (`components/shell/Sidebar.tsx`)

- **States:** `collapsed` (icon-only, 64px) ↔ `expanded` (256px/320px)
- **Navigation:** Module-aware links via TanStack Router `<Link>`
- **Sections:** Primary nav, secondary (settings, help), user profile
- **Mobile:** Hidden (replaced by `MobileNav` + `Sheet` drawer)

### 4.3 TopBar (`components/shell/TopBar.tsx`)

- **Left:** Module switcher (dropdown), page breadcrumb
- **Center:** Global search (`SearchCommand` — `Command` primitive)
- **Right:** Notifications (`NotificationCenter` — `Sonner` + `DropdownMenu`), user avatar menu

### 4.4 ModuleSwitcher (`components/shell/ModuleSwitcher.tsx`)

```tsx
// Sets data-module on <html> → instant CSS token swap (no React re-render)
<select onChange={e => setModule(e.target.value as ModuleId)}>
  <option value="overview">Overview</option>
  <option value="event">Events</option>
  <option value="commerce">Commerce</option>
  <option value="autocare">Auto Care</option>
</select>
```

### 4.5 MobileNav (`components/shell/MobileNav.tsx`)

- **Bottom tab bar:** 4 tabs (Overview, Events, Commerce, Auto Care)
- **Active indicator:** Module-colored pill
- **Hamburger menu:** Opens `Sidebar` in `Sheet` (bottom on mobile)

---

## 5. Routing (TanStack Router)

### 5.1 Route Tree

```
__root.tsx
├── login.tsx                    # Public auth
├── app.tsx                      # AppShell + outlet (protected)
│   ├── app.index.tsx            # Dashboard (overview)
│   ├── app.events/
│   │   ├── list.tsx             # Events list + create
│   │   ├── $eventId.tsx         # Event detail (tabs: overview, tickets, attendees)
│   │   ├── attendees.tsx        # Attendee management
│   │   └── checkin.tsx          # QR code check-in flow
│   ├── app.commerce/
│   │   ├── index.tsx            # Products list + create
│   │   ├── orders/
│   │   │   ├── index.tsx        # Orders list
│   │   │   └── $orderId.tsx     # Order detail + timeline
│   │   └── checkout.tsx         # Public store checkout
│   ├── app.autocare/
│   │   ├── index.tsx            # Dashboard (bays, schedule, work orders)
│   │   ├── services.tsx         # Services CRUD
│   │   ├── vehicles.tsx         # Vehicle registry
│   │   └── staff.tsx            # Staff management
│   └── app.customers.$customerId.tsx  # Cross-module customer detail
```

### 5.2 Route Patterns

- **Loaders:** `loader: async () => { return await queryClient.ensureQueryData(...) }`
- **Actions:** `action: async ({ request }) => { const form = await request.formData(); ... }`
- **Validation:** Zod schemas per route
- **Type Safety:** `Route` types auto-generated, `Link`/`useNavigate` fully typed

---

## 6. State Management

### 6.1 Global Client State (React Context — `lib/store.tsx`)

```tsx
interface AppState {
  module: ModuleId | "overview";
  user: User | null;
  business: Business | null;
  setModule: (m: ModuleId) => void;
  setUser: (u: User) => void;
}
```

- **Provider** at root (`AppShell`)
- **Consumers:** `ModuleSwitcher`, `Sidebar`, route components
- **Persistence:** `localStorage` for module preference

### 6.2 Server State (TanStack Query)

```tsx
// Query keys: ['events'], ['event', id], ['commerce', 'products'], etc.
queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});
```

- **Mock data** in `src/data/*.ts` (simulates REST API)
- **Mutations** for create/update/delete with optimistic updates
- **Invalidation** on mutation success

### 6.3 Form State (React Hook Form + Zod)

```tsx
const form = useForm<EventForm>({
  resolver: zodResolver(eventSchema),
  defaultValues: { name: "", date: "", ... },
});
```

- **Per-route** form instances
- **Validation** on blur/submit
- **Error display** via `FormField` error prop

### 6.4 UI State (Local)

- **Component-level:** `useState` for dialogs, dropdowns, tabs, filters
- **DataTable:** Internal search query, filter chips, sort state
- **PaymentPanel:** Method selection, processing state

---

## 7. Data Flow

### 7.1 Read Path (Query)

```
Route Loader
    │
    ▼
TanStack Query (queryKey)
    │
    ├── Cache hit → return data
    │
    └── Cache miss → fetch from API (mock in data/*.ts)
                          │
                          ▼
                    Transform/normalize
                          │
                          ▼
                    Update cache → return data
                          │
                          ▼
                    Route component renders with data
```

### 7.2 Write Path (Mutation)

```
User Action (button click)
    │
    ▼
React Hook Form validate
    │
    ▼
TanStack Mutation (mutationKey)
    │
    ├── Optimistic update (optional) → immediate UI update
    │
    ▼
API call (mock: setTimeout + data update)
    │
    ├── Success → invalidateQueries → refetch → toast success
    │
    └── Error → rollback optimistic → toast error
```

### 7.3 Module Context Flow

```
ModuleSwitcher onChange
    │
    ▼
AppContext.setModule("commerce")
    │
    ├── Sidebar: re-renders nav links (filtered by module)
    ├── TopBar: updates breadcrumb, search scope
    ├── AppShell: sets <html data-module="commerce">
    │       │
    │       └── CSS tokens swap instantly (--module, --chart-1, etc.)
    │
    └── Routes: navigate to module root (/app/commerce)
```

---

## 8. Domain Modules

### 8.1 Events Module

**Types:** `Event`, `TicketType`, `Booking`, `Attendee`, `CheckIn`

**Routes:**
- `list` — DataTable with search, status filters, create dialog
- `$eventId` — Tabbed detail: Overview (metrics), Tickets (Card grid), Attendees (Table)
- `attendees` — AttendeeTable with check-in actions, bulk operations
- `checkin` — QRCodeCheckIn (camera + manual code entry)

**Components:** `EventCard`, `TicketCard`, `CapacityBar`, `EventCalendar`, `DigitalTicket`, `QRCodeCheckIn`, `AttendeeTable`

### 8.2 Commerce Module

**Types:** `Product`, `ProductVariant`, `Category`, `Order`, `OrderItem`, `Discount`, `CartLine`, `InventoryItem`

**Routes:**
- `index` — Product grid/cards, variant editor dialog, stock adjustments
- `orders/index` — Orders DataTable with status filters, timeline
- `orders/$orderId` — Order detail + `OrderTimeline`, payment panel
- `checkout` — Public store: `StoreLayout`, `ProductCard`, `Cart`, payment

**Components:** `ProductCard`, `VariantEditor`, `StockAdjustDialog`, `Cart`, `StoreLayout`, `OrderTimeline`

### 8.3 Auto Care Module

**Types:** `Bay`, `Service`, `Vehicle`, `StaffMember`, `Appointment`, `WorkOrder`, `ChecklistItem`

**Routes:**
- `index` — Dashboard: BayCard grid, ResourceScheduler (calendar), WorkOrderCard list
- `services` — Service CRUD, pricing, duration, bay type assignment
- `vehicles` — VehicleCard list, customer linkage
- `staff` — StaffCard, shift management, skill assignment

**Components:** `BayCard`, `WorkOrderCard`, `ServiceCard`, `VehicleCard`, `StaffCard`, `ResourceScheduler`, `ServiceTimeline`, `VehicleBadge`

---

## 9. Shared Domain Logic

### 9.1 Payment System (Reusable)

`PaymentPanel` (`kit/PaymentPanel.tsx`) used by all three modules:

```tsx
interface PaymentSummary {
  subtotal: number;
  discount?: number;
  tax?: number;
  deposit?: number;
  total: number;
  balance?: number;
  status?: PaymentStatus;
}

<PaymentPanel
  summary={summary}
  onPay={method => mutatePayment({ ...summary, method })}
  defaultMethod="card"
/>
```

- **Methods:** Cash, Card, Online (GCash/Maya/Bank)
- **Flow:** Select method → CTA → processing spinner → success confirmation
- **Types:** `Payment`, `PaymentMethod`, `PaymentStatus` in `types/index.ts`

### 9.2 Customer Management (Cross-Module)

- **Shared type:** `Customer` in `types/index.ts`
- **Route:** `app.customers.$customerId.tsx` — unified detail view
- **Data:** `src/data/customers.ts` — single source of truth
- **Tabs:** Overview, Events bookings, Commerce orders, Auto Care vehicles/work orders

### 9.3 Notifications (System-Wide)

- **Toast:** `Sonner` (`ui/sonner.tsx`) — success, error, info, loading
- **Center:** `NotificationCenter` (TopBar dropdown) — persistent list, mark read, navigation
- **Types:** `Notification` in `types/index.ts` — module-scoped or system

---

## 10. Component Communication Patterns

### 10.1 Parent → Child (Props)

```tsx
// Route fetches data, passes to composed components
<DataTable
  rows={events}
  columns={eventColumns}
  rowKey={e => e.id}
  searchable={e => `${e.name} ${e.venue}`}
  filters={statusFilters}
  onRowClick={e => navigate({ to: `/app/events/${e.id}` })}
/>
```

### 10.2 Child → Parent (Callbacks)

```tsx
// Kit component exposes typed callbacks
<PaymentPanel
  onPay={handlePayment}  // (method: PaymentMethod) => void
  onCancel={closeDialog}
/>
```

### 10.3 Cross-Component (Context)

```tsx
// Module context — consumed by Sidebar, TopBar, routes, domain components
const { module } = useModule();
```

### 10.4 URL as State (TanStack Router)

- **Search params:** `?q=search&status=confirmed&page=2` → DataTable reads via `useSearch()`
- **Filters:** Synced to URL for shareable/bookmarkable state
- **Modals:** `SearchCommand` opens via `navigate({ search: { cmd: "open" } })`

---

## 11. Performance Strategies

| Strategy | Implementation |
|----------|----------------|
| **Code Splitting** | Route-level lazy loading via TanStack Start |
| **Virtualization** | Not yet needed (data sets < 500); `DataTable` ready for `react-window` |
| **Memoization** | `React.memo` on `MetricCard`, `PersonCell`, `StatusBadge` |
| **Query Caching** | `staleTime: 30s`, `gcTime: 5min`, background refetch |
| **Optimistic Updates** | Mutations update cache immediately, rollback on error |
| **Animation Performance** | `transform`/`opacity` only, `will-change` avoided, `layout` FLIP |
| **Bundle Size** | `lucide-react` tree-shaken, `recharts` only in `Charts.tsx` |

---

## 12. Developer Workflow

### 12.1 Adding a New Primitive (`ui/`)

```bash
# 1. Create component
touch src/components/ui/new-component.tsx

# 2. Follow pattern: Radix + CVA + cn() + forwardRef + displayName
# 3. Export from src/components/ui/index.ts (if barrel exists)
# 4. Use in kit/domain components
```

### 12.2 Adding a Kit Component (`kit/`)

```bash
# 1. Create in src/components/kit/NewComponent.tsx
# 2. Compose primitives + design tokens only
# 3. Export from src/components/kit/index.ts
# 4. Document variants/props in JSDoc
```

### 12.3 Adding a Domain Component

```bash
# 1. Create in src/components/{events,commerce,autocare}/
# 2. Use kit components + domain types
# 3. Co-locate with domain routes
```

### 12.4 Adding a Route

```bash
# 1. Create file in routes/ (e.g., app.events.new.tsx)
# 2. Define loader/action if needed
# 3. Add Link in Sidebar/ModuleSwitcher
# 4. Type-safe navigation via generated route tree
```

---

## 13. Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| **Unit** | Vitest + React Testing Library | Kit components, format/status utils |
| **Integration** | Playwright | Critical flows: checkout, check-in, work order completion |
| **Visual** | Chromatic / Storybook | Primitive + Kit component states |
| **Type** | TypeScript strict mode | 100% — no `any` in production code |

---

## 14. Deployment & Build

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",           // SSR + SPA chunks
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

- **Output:** `dist/` (server + client)
- **Platform:** Node.js (Nitro) or static hosting (Vercel, Netlify, Cloudflare)
- **Environment:** `VITE_API_URL`, `VITE_APP_NAME` via `.env`

---

## 15. File Reference (Architecture)

```
src/
├── components/
│   ├── ui/                    # 39 primitives (Radix + CVA)
│   ├── kit/                   # 12 composed patterns
│   ├── shell/                 # AppShell, Sidebar, TopBar, ModuleSwitcher, MobileNav
│   ├── events/                # Event domain components
│   ├── commerce/              # Commerce domain components
│   └── autocare/              # Auto Care domain components
├── hooks/
│   ├── use-mobile.tsx         # Media query hook
│   └── use-simulated-loading.tsx  # Dev loading simulator
├── lib/
│   ├── utils.ts               # cn()
│   ├── format.ts              # Formatters
│   ├── status.ts              # toneFor()
│   └── store.tsx              # Global Context (module, user, business)
├── routes/                    # File-based routing (TanStack Router)
├── data/                      # Mock data per module
├── types/index.ts             # Domain types
├── styles.css                 # Design tokens
├── app.tsx                    # Root + AppShell
└── start.ts                   # Entry
```