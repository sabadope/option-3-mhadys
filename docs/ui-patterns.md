# Nimbus OS — UI Patterns & Component Compositions

**Version:** 1.0  
**Scope:** Exact layout patterns, component compositions, responsive behaviors, and state variations for AI-assisted recreation

---

## 1. Page Layout Patterns

### 1.1 Standard Page Shell (All Module Pages)

```tsx
// Route component structure
export default function Page() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Module Name"
        title="Page Title"
        description="Optional description for context"
        actions={<PrimaryAction />}
        atmosphere={true}
      />

      {/* 2. Metric Row (optional) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Metric 1" value="1,234" delta={12.5} />
        <MetricCard label="Metric 2" value="₱56.7k" delta={-3.2} />
        <MetricCard label="Metric 3" value="89%" delta={0} />
        <MetricCard label="Metric 4" value="12" />
      </div>

      {/* 3. Primary Content - SectionCard or DataTable */}
      <SectionCard title="Section Title" eyebrow="Subtitle" action={<SecondaryAction />}>
        <DataTableOrContent />
      </SectionCard>

      {/* 4. Additional Sections (optional) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Left Panel">...</SectionCard>
        <SectionCard title="Right Panel">...</SectionCard>
      </div>
    </div>
  );
}
```

**Measurements:**
- Page padding: `p-4 sm:p-6 lg:p-8` (16/24/32px)
- Section gap: `space-y-6` (24px)
- Metric grid: `gap-4`, `sm:grid-cols-2`, `xl:grid-cols-4`
- Content max-width: implicit via container in AppShell

---

### 1.2 Dashboard / Overview Page

```tsx
// Used in: app.index.tsx (overview), app.autocare.index.tsx
<div className="space-y-6 p-4 sm:p-6 lg:p-8">
  {/* Welcome Header - no atmosphere */}
  <PageHeader
    title="Dashboard"
    description="Welcome back. Here's what's happening today."
    actions={<QuickActions />}
  />

  {/* Key Metrics - 4 columns on xl */}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <MetricCard
      label="Revenue"
      value={peso(totalRevenue)}
      delta={revenueDelta}
      hint="vs last month"
      icon={<DollarSign className="text-module" />}
      visual={<Sparkline data={revenueTrend} dataKey="value" />}
    />
    <MetricCard
      label="Orders"
      value={ordersCount}
      delta={ordersDelta}
      icon={<ShoppingBag />}
    />
    <MetricCard
      label="Appointments"
      value={appointmentsToday}
      hint="Today"
      icon={<Calendar />}
    />
    <MetricCard
      label="Utilization"
      value={`${utilization}%`}
      delta={utilDelta}
      icon={<Activity />}
    />
  </div>

  {/* Charts Row - 2 columns */}
  <div className="grid gap-4 lg:grid-cols-2">
    <SectionCard title="Revenue Trend" eyebrow="Last 30 days">
      <TrendAreaChart data={revenueData} dataKey="value" format={peso} height={280} />
    </SectionCard>
    <SectionCard title="Top Categories" eyebrow="By volume">
      <RankedBars items={topCategories} format={peso} />
    </SectionCard>
  </div>

  {/* Activity Feed - Full width */}
  <SectionCard title="Recent Activity" action={<ViewAll />}>
    <ActivityFeed items={recentActivity} />
  </SectionCard>
</div>
```

---

### 1.3 List Page (DataTable + Toolbar)

```tsx
// Used in: app.events.list.tsx, app.commerce.orders.index.tsx
<div className="space-y-6 p-4 sm:p-6 lg:p-8">
  <PageHeader
    eyebrow="Events"
    title="All Events"
    description="Manage your event portfolio and track attendance."
    actions={
      <>
        <Button variant="outline" size="sm">Export</Button>
        <Button variant="module" onClick={openCreateDialog}>
          <Plus className="mr-2 size-4" /> Create Event
        </Button>
      </>
    }
  />

  {/* Toolbar integrated in DataTable */}
  <DataTable
    rows={events}
    columns={eventColumns}
    rowKey={e => e.id}
    searchable={e => `${e.name} ${e.venue} ${e.category}`}
    searchPlaceholder="Search events..."
    filters={[
      { key: "status", label: "Status", options: statusOptions },
      { key: "category", label: "Category", options: categoryOptions },
    ]}
    filterFn={(row, active) => {
      if (active.status && row.status !== active.status) return false;
      if (active.category && row.category !== active.category) return false;
      return true;
    }}
    onRowClick={e => navigate({ to: `/app/events/${e.id}` })}
    empty={{
      title: "No events yet",
      description: "Create your first event to get started.",
      action: <Button variant="module" onClick={openCreateDialog}>Create Event</Button>,
      icon: <Calendar />
    }}
  />
</div>
```

**DataTable Column Definition Pattern:**
```tsx
const eventColumns: Column<Event>[] = [
  {
    key: "name",
    header: "Event",
    cell: e => (
      <div className="min-w-0">
        <p className="font-medium truncate">{e.name}</p>
        <p className="text-xs text-muted-foreground truncate">{e.venue}</p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    cell: e => formatDateLong(e.date),
    className: "hidden sm:table-cell",
  },
  {
    key: "status",
    header: "Status",
    cell: e => <StatusBadge status={e.status} />,
  },
  {
    key: "capacity",
    header: "Capacity",
    align: "right",
    cell: e => (
      <span className="tabular font-medium">
        {e.ticketsSold}/{e.capacity}
      </span>
    ),
    className: "hidden lg:table-cell",
  },
];
```

---

### 1.4 Detail Page (Tabbed / Sectioned)

```tsx
// Used in: app.events.$eventId.tsx, app.commerce.orders.$orderId.tsx
<div className="space-y-6 p-4 sm:p-6 lg:p-8">
  {/* Header with context actions */}
  <PageHeader
    eyebrow={event.category}
    title={event.name}
    description={event.description}
    actions={
      <>
        <Button variant="ghost" size="sm">Duplicate</Button>
        <Button variant="outline" size="sm">Export</Button>
        <Button variant="module">Edit Event</Button>
      </>
    }
  />

  {/* Tab Navigation (glass material) */}
  <div className="glass rounded-2xl p-1" role="tablist">
    <button
      role="tab"
      aria-selected={tab === "overview"}
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
        tab === "overview" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => setTab("overview")}
    >
      Overview
    </button>
    <button
      role="tab"
      aria-selected={tab === "tickets"}
      className={cn(...)}
      onClick={() => setTab("tickets")}
    >
      Tickets ({ticketTypes.length})
    </button>
    <button
      role="tab"
      aria-selected={tab === "attendees"}
      className={cn(...)}
      onClick={() => setTab("attendees")}
    >
      Attendees ({attendees.length})
    </button>
  </div>

  {/* Tab Panels */}
  {tab === "overview" && (
    <>
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tickets Sold" value={totalSold} />
        <MetricCard label="Revenue" value={peso(totalRevenue)} />
        <MetricCard label="Capacity" value={`${pct}%`} />
        <MetricCard label="Check-ins" value={checkedIn} />
      </div>

      {/* Capacity Bar */}
      <SectionCard title="Capacity" eyebrow="Real-time">
        <CapacityBar
          total={event.capacity}
          sold={totalSold}
          checkedIn={checkedIn}
        />
      </SectionCard>

      {/* Ticket Types Grid */}
      <SectionCard title="Ticket Types" action={<CreateTicket />}>
        <div className="grid gap-4 sm:grid-cols-2">
          {ticketTypes.map(t => <TicketCard key={t.id} ticket={t} event={event} />)}
        </div>
      </SectionCard>
    </>
  )}

  {tab === "attendees" && (
    <AttendeeTable
      attendees={attendees}
      onCheckIn={handleCheckIn}
      onBulkCheckIn={handleBulkCheckIn}
    />
  )}
</div>
```

---

### 1.5 Form Page (Create / Edit)

```tsx
// Used in: Create dialogs, Edit pages, Settings
<div className="space-y-6 p-4 sm:p-6 lg:p-8">
  <PageHeader
    title={isEdit ? "Edit Event" : "Create Event"}
    description={isEdit ? "Update event details" : "Fill in the details to create a new event."}
    actions={
      <Button variant="module" onClick={handleSubmit}>
        {isEdit ? "Save Changes" : "Create Event"}
      </Button>
    }
  />

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Basic Info Section */}
    <FormSection title="Basic Information" description="Required fields marked with *">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Event Name" htmlFor="name" required>
          <Input id="name" {...register("name")} placeholder="Summer Music Festival" />
        </FormField>
        <FormField label="Category" htmlFor="category" required>
          <Select {...register("category")}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Date" htmlFor="date" required>
          <Input id="date" type="date" {...register("date")} />
        </FormField>
        <FormField label="Time" htmlFor="time" required>
          <div className="grid grid-cols-2 gap-3">
            <Input id="startTime" type="time" {...register("startTime")} placeholder="Start" />
            <Input id="endTime" type="time" {...register("endTime")} placeholder="End" />
          </div>
        </FormField>
        <FormField label="Venue" htmlFor="venue" className="sm:col-span-2">
          <Input id="venue" {...register("venue")} placeholder="Venue name" />
        </FormField>
        <FormField label="Address" htmlFor="address" className="sm:col-span-2">
          <Textarea id="address" {...register("address")} rows={2} placeholder="Full address" />
        </FormField>
      </div>
    </FormSection>

    {/* Ticket Types Section */}
    <FormSection title="Ticket Types" description="Add at least one ticket type">
      <div className="space-y-4">
        {ticketTypes.map((t, i) => (
          <TicketTypeRow key={t.id} index={i} ticket={t} onRemove={() => removeTicket(i)} />
        ))}
        <Button variant="outline" type="button" onClick={addTicketType}>
          <Plus className="mr-2 size-4" /> Add Ticket Type
        </Button>
      </div>
    </FormSection>

    {/* Advanced Settings (Collapsible) */}
    <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronDown className={cn("size-4 transition-transform", advancedOpen && "rotate-180")} />
        Advanced Settings
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-5">
        <FormSection title="Advanced">
          <FormField label="Cover Image URL" htmlFor="coverImage">
            <Input id="coverImage" {...register("coverImage")} placeholder="https://..." />
          </FormField>
          <FormField label="Description" htmlFor="description">
            <Textarea id="description" {...register("description")} rows={4} />
          </FormField>
        </FormSection>
      </CollapsibleContent>
    </Collapsible>
  </form>
</div>
```

---

### 1.6 Settings Page

```tsx
// Used in: Settings routes
<div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
  <PageHeader title="Settings" description="Manage your account and preferences." />

  {/* Sidebar navigation on desktop, tabs on mobile */}
  <div className="hidden lg:grid lg:grid-cols-[220px_1fr] gap-6">
    {/* Settings Navigation */}
    <nav className="space-y-1 glass rounded-2xl p-3" aria-label="Settings">
      {settingsSections.map(s => (
        <button
          key={s.key}
          role="tab"
          aria-selected={activeSection === s.key}
          className={cn(
            "w-full px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors",
            activeSection === s.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          onClick={() => setActiveSection(s.key)}
        >
          {s.label}
        </button>
      ))}
    </nav>

    {/* Settings Panels */}
    <div>
      {activeSection === "profile" && <ProfileSettings />}
      {activeSection === "notifications" && <NotificationSettings />}
      {activeSection === "billing" && <BillingSettings />}
      {activeSection === "team" && <TeamSettings />}
    </div>
  </div>

  {/* Mobile: Tabs */}
  <div className="lg:hidden">
    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="glass grid w-full grid-cols-4 p-1">
        {settingsSections.map(s => (
          <TabsTrigger key={s.key} value={s.key} className="py-2 text-xs">{s.label}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="profile" className="mt-4"><ProfileSettings /></TabsContent>
      <TabsContent value="notifications" className="mt-4"><NotificationSettings /></TabsContent>
      <TabsContent value="billing" className="mt-4"><BillingSettings /></TabsContent>
      <TabsContent value="team" className="mt-4"><TeamSettings /></TabsContent>
    </Tabs>
  </div>
</div>
```

---

## 2. Component Compositions

### 2.1 Metric Card Variants

```tsx
// Standard KPI
<MetricCard
  label="Total Revenue"
  value={peso(1_234_567)}
  delta={12.5}
  hint="vs last month"
  icon={<DollarSign className="text-module" />}
  size="md"
/>

// Large (for dashboard hero)
<MetricCard
  label="Active Users"
  value="2,847"
  delta={8.2}
  size="lg"
  visual={<Sparkline data={userTrend} dataKey="value" width={120} height={40} />}
/>

// Compact Stat (inside panels)
<Stat label="Conversion" value="3.2%" />
<Stat label="Avg. Order" value={peso(1_250)} />
```

**Internal Layout:**
```
MetricCard (surface, rounded-2xl, p-5, min-w-0, flex-col, justify-between)
├── Header Row (flex, items-start, justify-between, gap-3)
│   ├── Eyebrow (label)
│   └── Icon (text-muted-foreground, size-4)
└── Value Row (mt-3, flex, flex-wrap, items-end, justify-between, gap-x-4, gap-y-2)
    ├── Value Block (min-w-0)
    │   ├── Value (tabular, font-semibold, tracking-tight, text-[28px]/text-3xl)
    │   └── Delta/Hint Row (mt-2, flex, items-center, gap-1.5, text-xs, text-muted-foreground)
    │       ├── Delta Badge (inline-flex, items-center, gap-0.5, font-medium, green/red)
    │       │   ├── ArrowUpRight/ArrowDownRight (size-3.5)
    │       │   └── % value
    │       └── Hint (text-muted-foreground)
    └── Visual Block (shrink-0) — Sparkline, Progress, RankedBars
```

---

### 2.2 Status Badge Compositions

```tsx
// Inline in tables
<StatusBadge status="confirmed" />

// With custom label
<StatusBadge status="processing" label="Processing Payment" />

// Without dot (compact)
<StatusBadge status="paid" dot={false} />

// Module-themed (for in_progress, busy, etc.)
<StatusBadge status="in_progress" tone="module" />

// Sizes via className override
<StatusBadge status="active" className="h-5 px-2 text-[10px]" />  // Smaller
```

---

### 2.3 DataTable Compositions

#### Desktop Table Mode (≥md)
```
DataTable
├── Toolbar (flex, flex-wrap, items-center, gap-2)
│   ├── Search (relative, min-w-0, flex-1, sm:max-w-xs)
│   │   ├── Search Icon (absolute, left-3, top-1/2, -translate-y-1/2, size-4, text-muted-foreground)
│   │   └── Input (h-10, rounded-full, border-border-strong, bg-surface-2, pl-9)
│   ├── Filter Chips (hidden lg:flex, flex-wrap, items-center, gap-1.5)
│   │   └── Filter Group (flex, items-center, gap-1.5, rounded-full, bg-surface-2, p-1)
│   │       ├── Chip "All" (selected style)
│   │       └── Chip options...
│   ├── Sheet Trigger (lg:hidden) — Button variant="secondary" size="sm"
│   └── Toolbar Extra (ml-auto, flex, items-center, gap-2)
├── Table Container (surface, hidden md:block, overflow-hidden, rounded-2xl)
│   └── Table (w-full, text-sm)
│       ├── Thead (border-b, border-border, text-left)
│       │   └── Tr (eyebrow, px-5, py-3, font-semibold)
│       └── Tbody (divide-y, divide-border)
│           └── Motion.tr (layout, initial/exit animate, onClick, tabIndex, className)
│               └── Td (px-5, py-3.5/2.5, align-middle)
└── Mobile Cards (md:hidden, grid, gap-3)
    └── Motion.div (layout, surface, rounded-2xl, p-4, press/cursor-pointer)
        └── renderCard OR auto dl grid (grid-cols-2, gap-x-4, gap-y-2, text-sm)
            ├── dt (text-[11px], uppercase, tracking-wider, text-muted-foreground)
            └── dd (truncate)
```

#### Filter Sheet (Mobile)
```
Sheet (side="bottom")
└── SheetContent (glass-strong, rounded-t-3xl, border-t, pb-10)
    ├── SheetHeader (text-left)
    │   └── SheetTitle "Filters"
    └── Filter Controls (mt-4, flex, flex-col, gap-4)
        └── Per Filter:
            ├── Eyebrow (label)
            └── Chip Group (flex, flex-wrap, gap-1.5)
                ├── Chip "All"
                └── Chip options...
```

---

### 2.4 Timeline Compositions

```tsx
// Vertical Timeline (Order/WorkOrder/Booking detail)
<Timeline
  steps={[
    { key: "booked", label: "Booked", at: "Sep 12, 2:30 PM" },
    { key: "confirmed", label: "Confirmed", at: "Sep 12, 3:15 PM" },
    { key: "in_progress", label: "In Progress", at: "Sep 13, 9:00 AM" },
    { key: "completed", label: "Completed", at: "Sep 13, 11:30 AM" },
  ]}
  currentIndex={2}  // 0-based, current step
/>

// Horizontal Progress Steps (Card headers)
<ProgressSteps
  steps={["Booked", "Confirmed", "In Progress", "Completed"]}
  currentIndex={2}
/>
```

**Vertical Timeline DOM:**
```
ol (relative, space-y-0)
└── li (relative, flex, gap-4, pb-6) × steps
    ├── Connector Column (flex, flex-col, items-center)
    │   ├── Step Indicator (motion.span, size-6, grid, place-items-center, rounded-full, border, text-[10px])
    │   │   ├── Done: border-module, bg-module, text-module-foreground, Check (size-3.5, strokeWidth=3)
    │   │   ├── Current: border-module, bg-module-soft, text-module, ring-4 ring-module/15, dot (size-1.5, bg-module)
    │   │   └── Upcoming: border-border-strong, bg-surface, text-muted-foreground, dot (size-1.5, bg-border-strong)
    │   └── Connecting Line (w-px, flex-1) — Done: bg-module/60, else: bg-border
    └── Content Column (min-w-0, pb-6, last:pb-0)
        ├── Label (text-sm, font-medium, leading-6) — Upcoming: text-muted-foreground
        └── Hint/Time (text-xs, text-muted-foreground)
```

---

### 2.5 Card Grid Patterns

#### Event/Service/Product Cards (3-column responsive)
```tsx
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {items.map(item => (
    <Card key={item.id} className="surface overflow-hidden transition-shadow hover:shadow-elevated">
      {/* Image/Header */}
      <div className="relative aspect-video bg-surface-2 overflow-hidden">
        <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
        <StatusBadge status={item.status} className="absolute top-3 right-3" />
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold tracking-tight truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-medium text-module">{formatPrice(item.price)}</span>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      </div>
    </Card>
  ))}
</div>
```

#### Dashboard Widget Cards (2-column)
```tsx
<div className="grid gap-4 lg:grid-cols-2">
  <SectionCard title="Widget Title" action={<Action />}>
    {/* Chart or content */}
  </SectionCard>
  <SectionCard title="Widget Title">
    {/* Content */}
  </SectionCard>
</div>
```

---

### 2.6 Modal / Dialog Patterns

#### Create/Edit Dialog (Sheet on Mobile, Dialog on Desktop)
```tsx
// Desktop: Dialog, Mobile: Sheet (bottom)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="glass-strong rounded-3xl border max-w-lg sm:max-w-2xl max-h-[90vh]">
    <DialogHeader className="border-b border-border px-6 py-4">
      <DialogTitle className="text-[15px] font-semibold tracking-tight">Create Event</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">Fill in the details below.</DialogDescription>
    </DialogHeader>
    <DialogContent className="p-6 overflow-y-auto">
      <Form ... />
    </DialogContent>
    <DialogFooter className="border-t border-border px-6 py-4 flex justify-end gap-2">
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="module" onClick={handleSubmit}>Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Confirmation Dialog (Destructive)
```tsx
<ConfirmDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  title="Delete Event?"
  description="This will permanently delete the event and all associated data. This cannot be undone."
  confirmLabel="Delete"
  destructive={true}
  onConfirm={handleDelete}
/>
```

#### Command Palette (Global Search)
```tsx
// Triggered from TopBar or Cmd+K
<Command>
  <CommandInput placeholder="Search..." className="h-11 rounded-xl bg-surface-2 border-border-strong" />
  <CommandList className="max-h-[400px]">
    <CommandGroup heading="Events">
      {events.map(e => (
        <CommandItem key={e.id} onSelect={() => navigate(`/app/events/${e.id}`)}>
          <CommandItemFilter>{e.name}</CommandItemFilter>
          <span className="flex items-center gap-2">
            <span className="truncate">{e.name}</span>
            <StatusBadge status={e.status} dot={false} className="ml-auto" />
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
    <CommandGroup heading="Actions">
      <CommandItem onSelect={() => navigate("/app/events/new")}>
        <Plus className="mr-2 size-4" /> Create Event
      </CommandItem>
      <CommandItem onSelect={() => navigate("/app/commerce/new")}>
        <Package className="mr-2 size-4" /> Add Product
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

### 2.7 Navigation Patterns

#### Sidebar (Desktop)
```
<aside className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300">
  {/* Brand */}
  <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
    <Brand />
  </div>

  {/* Primary Navigation */}
  <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Main">
    {navItems.map(item => (
      <Link
        key={item.key}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="size-5 shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.badge && <span className="ml-auto px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-module/20 text-module">{item.badge}</span>}
      </Link>
    ))}
  </nav>

  {/* Module Switcher */}
  <div className="border-t border-sidebar-border p-3">
    <ModuleSwitcher />
  </div>

  {/* User Profile */}
  <div className="border-t border-sidebar-border p-3">
    <UserMenu />
  </div>
</aside>
```

#### Mobile Bottom Nav
```
<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border px-2 py-2 safe-area-bottom">
  <div className="flex items-center justify-around">
    {navItems.map(item => (
      <Link
        key={item.key}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium transition-colors",
          isActive ? "text-module" : "text-muted-foreground"
        )}
      >
        <item.icon className={cn("size-5", isActive && "text-module")} />
        {item.label}
      </Link>
    ))}
  </div>
</nav>
```

---

## 3. Responsive Behavior Specifications

### 3.1 Breakpoint-Specific Rendering

| Component | Base (<640px) | sm (640px+) | md (768px+) | lg (1024px+) | xl (1280px+) |
|-----------|---------------|-------------|-------------|--------------|--------------|
| **Page Padding** | 16px | 24px | 24px | 32px | 32px |
| **Metric Grid** | 1 col | 2 col | 2 col | 2 col | 4 col |
| **Card Grid** | 1 col | 2 col | 2 col | 2 col | 3 col |
| **DataTable** | Mobile Cards | Mobile Cards | Table | Table | Table |
| **Sidebar** | Hidden (Bottom Nav) | Hidden | Hidden | Visible (collapsed) | Visible (expanded) |
| **Settings** | Tabs | Tabs | Tabs | Sidebar + Panel | Sidebar + Panel |
| **Dialog** | Sheet (bottom) | Sheet (bottom) | Dialog | Dialog | Dialog |
| **Filter Chips** | Sheet only | Sheet only | Inline + Sheet | Inline + Sheet | Inline + Sheet |

### 3.2 DataTable Responsive Switch

```tsx
// Desktop (≥md): Table
<div className="surface hidden overflow-hidden rounded-2xl md:block">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">...</table>
  </div>
</div>

// Mobile (<md): Cards
<div className="grid gap-3 md:hidden">
  {filtered.map(row => (
    <motion.div
      key={rowKey(row)}
      layout
      className="surface rounded-2xl p-4 press cursor-pointer"
      onClick={onRowClick ? () => onRowClick(row) : undefined}
    >
      {renderCard ? renderCard(row) : <AutoDL columns={columns} row={row} />}
    </motion.div>
  ))}
</div>
```

### 3.3 Sheet vs Dialog

```tsx
// Responsive dialog pattern
const isMobile = useMobile(); // hook: useMediaQuery("(max-width: 767px)")

{isMobile ? (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent side="bottom" className="glass-strong rounded-t-3xl border-t max-h-[85vh]">
      <SheetHeader><SheetTitle>{title}</SheetTitle></SheetHeader>
      <div className="mt-4">{children}</div>
    </SheetContent>
  </Sheet>
) : (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="glass-strong rounded-3xl border max-w-lg">{children}</DialogContent>
  </Dialog>
)}
```

---

## 4. State Variations (Per Pattern)

### 4.1 Page States

| State | Implementation |
|-------|----------------|
| **Loading** | `<PageSkeleton />` — Header skeleton + 4 MetricSkeleton + TableSkeleton |
| **Empty** | `<EmptyState icon={Icon} title="No items" description="..." action={<CreateAction />} />` |
| **Error** | `<ErrorState message="Failed to load" onRetry={refetch} />` |
| **Partial** | Show loaded sections, skeletons for pending queries |

### 4.2 DataTable States

| State | Rendered |
|-------|----------|
| **Loading** | `<TableSkeleton rows={6} />` |
| **Empty (no filters)** | `EmptyState` with create action |
| **Empty (with filters/search)** | `EmptyState` title="No results", description="Try different search or clear filters" |
| **Error** | `ErrorState` with retry button |

### 4.3 Form States

| Field State | Visual |
|-------------|--------|
| **Default** | `border-border-strong bg-surface-2` |
| **Hover** | `border-border-strong bg-surface-2` (no change) |
| **Focus** | `ring-2 ring-ring ring-offset-2 ring-offset-background border-transparent` |
| **Error** | `border-destructive focus:ring-destructive`, error text below |
| **Disabled** | `opacity-50 cursor-not-allowed` |
| **Success** | No special style (toast confirms) |

### 4.4 Button States

| Variant | Default | Hover | Active | Focus | Disabled | Loading |
|---------|---------|-------|--------|-------|----------|---------|
| `default` | bg-primary | bg-primary/90 | scale(0.97) | ring-ring/60 | opacity-50 | Loader2 spin |
| `module` | bg-module | brightness-110 | scale(0.97) | ring-ring/60 | opacity-50 | Loader2 spin |
| `outline` | transparent | bg-accent | scale(0.97) | ring-ring/60 | opacity-50 | Loader2 spin |
| `ghost` | transparent | bg-accent | scale(0.97) | ring-ring/60 | opacity-50 | Loader2 spin |
| `glass` | glass | bg-accent/60 | scale(0.97) | ring-ring/60 | opacity-50 | Loader2 spin |

---

## 5. Exact Measurements Reference

### 5.1 Spacing Scale (Rem / Px)

| Token | Rem | Px | Usage |
|-------|-----|-----|-------|
| `space-y-1` | 0.25 | 4 | Tight gaps |
| `space-y-2` | 0.5 | 8 | Form field gaps |
| `space-y-3` | 0.75 | 12 | Component internal |
| `space-y-4` | 1 | 16 | Card gaps, grid gaps |
| `space-y-5` | 1.25 | 20 | Section internal |
| `space-y-6` | 1.5 | 24 | **Page section gap** |
| `space-y-8` | 2 | 32 | Large section gaps |
| `p-4` | 1 | 16 | Mobile page padding |
| `p-5` | 1.25 | 20 | Card/panel padding |
| `p-6` | 1.5 | 24 | Desktop card padding |
| `px-4` | 1 | 16 | Mobile horizontal |
| `px-6` | 1.5 | 24 | Tablet horizontal |
| `px-8` | 2 | 32 | Desktop horizontal |

### 5.2 Component Dimensions

| Component | Height | Width | Border Radius |
|-----------|--------|-------|---------------|
| Button (default) | 40px (h-10) | Auto | 9999px (rounded-full) |
| Button (sm) | 32px (h-8) | Auto | 9999px |
| Button (lg) | 48px (h-12) | Auto | 9999px |
| Button (xl) | 56px (h-14) | Auto | 9999px |
| Input | 44px (h-11) | Auto | 16px (rounded-xl) |
| Select Trigger | 44px (h-11) | Auto | 16px |
| Card | Auto | Auto | 16px (rounded-xl) |
| GlassPanel/SectionCard | Auto | Auto | 22px (rounded-2xl) |
| Sheet/Dialog | Auto | max-w-lg (32rem) | 26px (rounded-3xl) |
| StatusBadge | 24px (h-6) | Auto | 9999px |
| Avatar (sm) | 28px (size-7) | 28px | 9999px |
| Avatar (md) | 36px (size-9) | 36px | 9999px |
| Avatar (lg) | 56px (size-14) | 56px | 9999px |

### 5.3 Typography Measurements

| Role | Font Size | Line Height | Weight | Letter Spacing |
|------|-----------|-------------|--------|----------------|
| Eyebrow | 11px (0.6875rem) | 1.4 | 600 | 0.14em |
| Micro | 10px (0.625rem) | 1.3 | 500 | 0 |
| Body Small | 13px (0.8125rem) | 1.5 | 400 | 0 |
| Body | 14px (0.875rem) | 1.5 | 400 | 0 |
| Body Large | 15px (0.9375rem) | 1.6 | 400 | 0 |
| H3 | 15px | 1.4 | 600 | 0 |
| H2 | 20px (1.25rem) / 24px (sm) | 1.3 | 600 | -0.01em |
| H1 | 30px (1.875rem) / 36px (sm) | 1.2 | 600 | -0.01em |
| Metric Value (md) | 28px | 1 | 600 | tight |
| Metric Value (lg) | 36px (2.25rem) / 48px (sm) | 1 | 600 | tight |

---

## 6. Animation Specifications

### 6.1 Entrance Animations

| Component | Animation | Duration | Easing |
|-----------|-----------|----------|--------|
| PageHeader | `rise` (opacity 0→1, y 6→0) | 350ms | spring |
| MetricCard | opacity 0→1, y 8→0 | 300ms | spring (stiffness 260, damping 28) |
| DataTable Rows | layout (FLIP) + opacity | 180ms | ease-out |
| Sheet/Dialog | opacity + scale (0.95→1) | 250ms | spring |
| Toast | slide from bottom | 200ms | spring |
| Tooltip | fade + scale | 150ms | spring |

### 6.2 Interaction Animations

| Trigger | Animation |
|---------|-----------|
| Button press | `transform: scale(0.97)` — 150ms spring |
| Button hover | `background-color` — 200ms spring |
| Chip select | `background-color`, `color` — 150ms spring |
| Tab switch | `background-color`, `color` — 150ms spring |
| Timeline current pulse | `scale: 1.1` — continuous spring |
| RankedBars | width 0→target — spring (stiffness 120, damping 24, stagger 50ms) |
| Sparkline/Chart | opacity 0→1 — 500ms ease-out |

---

## 7. AI Recreation Guidelines

### 7.1 When Generating a Page

1. **Start with Page Shell** — `space-y-6 p-4 sm:p-6 lg:p-8`
2. **Add PageHeader** — eyebrow, title, description, actions, atmosphere
3. **Add Metrics** (if dashboard) — `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`
4. **Add Primary Content** — `SectionCard` wrapping `DataTable` or custom content
5. **Add Secondary Sections** — `grid gap-4 lg:grid-cols-2` for side-by-side

### 7.2 When Generating a DataTable

```tsx
// Always include these props
<DataTable
  rows={data}
  columns={columns}           // Column<Row>[] with key, header, cell, align, hideBelow
  rowKey={row => row.id}
  searchable={row => `${row.name} ${row.email} ${row.status}`}
  searchPlaceholder="Search..."
  filters={filterDefs}        // FilterDef[] with key, label, options[]
  filterFn={(row, active) => boolean}
  onRowClick={row => navigate(`/detail/${row.id}`)}
  empty={{
    title: "No items",
    description: "Create your first item.",
    action: <Button variant="module">Create</Button>,
    icon: <Icon />
  }}
/>
```

### 7.3 When Generating a Form

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <FormSection title="Section" description="Hint">
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField label="Label" htmlFor="id" required hint="Hint" error={errors.id}>
        <Input id="id" {...register("id")} />
      </FormField>
      {/* ... */}
    </div>
  </FormSection>
</form>
```

### 7.4 When Generating a Detail Page

1. **PageHeader** with context actions (Edit, Duplicate, Export)
2. **Tab Navigation** (glass, rounded-2xl, p-1) with role="tablist"
3. **Tab Panels** — each panel is a fragment with metric row + SectionCards
4. **Use `SectionCard`** for every content block

### 7.5 Color Application Rules

```tsx
// Primary actions → variant="module"
<Button variant="module">Primary</Button>

// Status → StatusBadge (auto-tone)
<StatusBadge status={item.status} />

// Module accent borders/rings → ring-module utility
<div className="ring-module">...</div>

// Charts → stroke="var(--module)", fill gradient with --module
<Area stroke="var(--module)" fill="url(#fill-id)" />

// Glass materials → glass / glass-strong utilities
<div className="glass glass-highlight">...</div>
```

---

## 8. Component Inventory (Copy-Paste Ready)

### 8.1 Required Imports (Per Pattern)

```tsx
// Page Layout
import { PageHeader } from "@/components/kit";
import { SectionCard, MetricCard, Stat } from "@/components/kit";
import { DataTable } from "@/components/kit";
import { StatusBadge } from "@/components/kit";
import { Timeline, ProgressSteps } from "@/components/kit";
import { GlassPanel } from "@/components/kit";
import { FormField, FormSection, inputClass } from "@/components/kit";
import { EmptyState, ErrorState, Skeleton, PageSkeleton } from "@/components/kit";
import { ConfirmDialog, PaymentPanel } from "@/components/kit";

// UI Primitives
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sonner } from "@/components/ui/sonner";
import { Toaster } from "sonner";

// Icons
import { Plus, Search, Filter, ChevronDown, Check, Loader2, DollarSign, ShoppingBag, Calendar, Activity } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";
import { peso, formatDate, formatDateLong, formatTime, initials, humanize } from "@/lib/format";
import { toneFor } from "@/lib/status";
```

### 8.2 Motion Imports

```tsx
import { motion, AnimatePresence } from "motion/react";
// Use: initial, animate, exit, transition, layout, whileHover, whileTap
```

---

## 9. Complete Page Template (Copy-Paste Starter)

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";

import { PageHeader, SectionCard, MetricCard, DataTable, StatusBadge, EmptyState } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FormField, FormSection, inputClass } from "@/components/kit";
import { cn } from "@/lib/utils";
import { peso, formatDateLong } from "@/lib/format";

interface Item {
  id: string;
  name: string;
  status: "active" | "pending" | "completed";
  // ...
}

const columns = [
  { key: "name", header: "Name", cell: (row: Item) => <span className="font-medium">{row.name}</span> },
  { key: "status", header: "Status", cell: (row: Item) => <StatusBadge status={row.status} /> },
  // ...
];

const statusFilters = [
  { key: "status", label: "Status", options: [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]},
];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Module"
        title="Items"
        description="Manage your items."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="module" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 size-4" /> Create Item
            </Button>
          </>
        }
      />

      <DataTable
        rows={items}
        columns={columns}
        rowKey={r => r.id}
        searchable={r => `${r.name} ${r.status}`}
        searchPlaceholder="Search items..."
        filters={statusFilters}
        filterFn={(row, active) => !active.status || row.status === active.status}
        onRowClick={item => console.log("View:", item.id)}
        empty={{
          title: "No items yet",
          description: "Create your first item to get started.",
          action: <Button variant="module" onClick={() => setCreateOpen(true)}>Create Item</Button>,
          icon: <Package className="size-6" />,
        }}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="glass-strong rounded-3xl border max-w-lg">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-[15px] font-semibold tracking-tight">Create Item</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Fill in the details below.</DialogDescription>
          </DialogHeader>
          <DialogContent className="p-6">
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setCreateOpen(false); }}>
              <FormField label="Name" htmlFor="name" required>
                <Input id="name" className={inputClass} placeholder="Item name" />
              </FormField>
              <FormField label="Status" htmlFor="status" required>
                <Select>
                  <SelectTrigger className={cn(inputClass, "h-11")}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </form>
          </DialogContent>
          <DialogFooter className="border-t border-border px-6 py-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="module" type="submit" form="create-form">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 10. Checklist for AI Recreation

### Page Structure
- [ ] `space-y-6 p-4 sm:p-6 lg:p-8` wrapper
- [ ] `PageHeader` with eyebrow, title, description, actions, atmosphere
- [ ] Metrics row: `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` + `MetricCard`
- [ ] Content sections: `SectionCard` with title, eyebrow, action
- [ ] Responsive grids: `lg:grid-cols-2`, `xl:grid-cols-3`, `xl:grid-cols-4`

### DataTable
- [ ] `searchable` function concatenating searchable fields
- [ ] `filters` array with `key`, `label`, `options[]`
- [ ] `filterFn` for multi-filter logic
- [ ] `onRowClick` for navigation
- [ ] `empty` state with title, description, action, icon
- [ ] Columns with `align: "right"`, `hideBelow: "lg"|"xl"`, custom `cell` renderers

### Forms
- [ ] `FormSection` wrapping `grid gap-5 sm:grid-cols-2`
- [ ] `FormField` with label, htmlFor, hint, error, required
- [ ] `inputClass` on all inputs: `h-11 rounded-xl border-border-strong bg-surface-2 px-3.5 text-[15px]`
- [ ] `Select` with `SelectTrigger`, `SelectContent`, `SelectItem`
- [ ] Collapsible advanced sections

### Dialogs
- [ ] `DialogContent` with `glass-strong rounded-3xl border`
- [ ] `DialogHeader` with border-b, Title, Description
- [ ] `DialogFooter` with border-t, Cancel (secondary), Confirm (module/destructive)
- [ ] Mobile: `Sheet` with `side="bottom"`, `glass-strong rounded-t-3xl border-t`

### Visual Polish
- [ ] `tabular` on all numbers
- [ ] `eyebrow` on all section labels and table headers
- [ ] `text-balance` on titles
- [ ] `truncate` on long text
- [ ] `press` utility on clickable cards
- [ ] `glass-highlight` on glass panels
- [ ] Module colors via `variant="module"`, `tone="module"`, `var(--module)`

---

*This document captures the exact patterns used in Nimbus OS. When porting to another application, use these compositions as building blocks — they are designed to work together cohesively.*