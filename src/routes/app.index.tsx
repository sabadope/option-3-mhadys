import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Car, Clock, MapPin, ShoppingBag, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { MetricCard, MetricSkeleton, SectionCard, Skeleton, Sparkline, StatusBadge, TrendAreaChart, Stat } from "@/components/kit";
import { InitialsAvatar } from "@/components/kit/Avatar";
import { useApp, eventSold } from "@/lib/store";
import { formatDate, formatTime, peso, timeAgo, TODAY } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { salesSeries } from "@/data/commerce";
import { activity } from "@/data/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — Nimbus" },
      { name: "description", content: "Unified overview of today's events, merchandise sales, and auto care operations." },
      { property: "og:title", content: "Overview — Nimbus" },
      { property: "og:description", content: "Everything happening across your business today." },
    ],
  }),
  component: Overview,
});

const revenueSpark = [
  { d: 1, v: 12 },
  { d: 2, v: 18 },
  { d: 3, v: 15 },
  { d: 4, v: 26 },
  { d: 5, v: 31 },
  { d: 6, v: 29 },
  { d: 7, v: 48 },
];

function Overview() {
  const loading = useSimulatedLoading(500);
  const { state } = useApp();

  const upcoming = state.events.filter((e) => e.status === "published" && e.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const hero = upcoming.find((e) => e.id === "ev_1") ?? upcoming[0];
  const pendingFulfillment = state.orders.filter((o) => ["pending", "confirmed", "processing", "packed"].includes(o.status)).length;
  const todayAppts = state.appointments.filter((a) => a.date === TODAY);
  const inProgress = todayAppts.filter((a) => a.status === "in_progress").length;
  const completed = 16;

  return (
    <div className="space-y-8">
      <motion.header initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}>
        <p className="eyebrow mb-2">Thursday, September 18</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning.</h1>
        <p className="mt-1.5 text-muted-foreground">Here's what's happening across your business today.</p>
      </motion.header>

      {/* Metrics: one hero metric + three compact */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <MetricCard label="Today's revenue" value={peso(48250)} delta={12.6} hint="vs. yesterday" size="lg" visual={<Sparkline data={revenueSpark} dataKey="v" width={110} height={40} />} className="sm:col-span-2 xl:col-span-1" />
          <MetricCard label="Bookings" value="34" delta={8.1} hint="tickets today" icon={<Ticket />} />
          <MetricCard label="Orders" value="18" delta={-3.2} hint={`${pendingFulfillment} pending fulfillment`} icon={<ShoppingBag />} />
          <MetricCard label="Vehicles serviced" value="21" delta={5.0} hint={`${inProgress} in progress`} icon={<Car />} />
        </div>
      )}

      {/* Module overview — three distinct compositions */}
      <div className="grid gap-4 xl:grid-cols-12">
        {/* EVENT */}
        <section data-module="event" className="xl:col-span-4">
          {loading || !hero ? (
            <Skeleton className="h-[420px] rounded-2xl" />
          ) : (
            <Link to="/app/events/$eventId" params={{ eventId: hero.id }} className="group block h-full">
              <div className="surface relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl">
                <img src={hero.coverImage} alt="" width={1536} height={864} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
                <div className="relative flex items-center justify-between p-5">
                  <span className="eyebrow rounded-full bg-background/50 px-2.5 py-1 text-module backdrop-blur">Upcoming event</span>
                  <span className="grid size-8 place-items-center rounded-full bg-module text-module-foreground">
                    <Ticket className="size-4" />
                  </span>
                </div>
                <div className="relative mt-auto p-5">
                  <h3 className="text-2xl font-semibold tracking-tight">{hero.name}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {formatDate(hero.date, "MMMM d")} · {formatTime(hero.startTime)} — {formatTime(hero.endTime)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {hero.venue}
                    </span>
                  </p>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="tabular font-semibold">
                        {eventSold(hero)} <span className="text-muted-foreground">/ {hero.capacity} attendees</span>
                      </span>
                      <span className="text-muted-foreground">{Math.round((eventSold(hero) / hero.capacity) * 100)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(eventSold(hero) / hero.capacity) * 100}%` }} transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.2 }} className="h-full rounded-full bg-module" />
                    </div>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-module">
                    View Event <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* MERCHANDISE */}
        <section data-module="commerce" className="xl:col-span-5">
          {loading ? (
            <Skeleton className="h-[420px] rounded-2xl" />
          ) : (
            <SectionCard
              eyebrow="Sales"
              className="h-full"
              action={
                <Link to="/app/commerce" className="inline-flex items-center gap-1 text-sm font-medium text-module">
                  Commerce <ArrowUpRight className="size-4" />
                </Link>
              }
              bodyClassName="pt-2"
            >
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="tabular text-4xl font-semibold tracking-tight">{peso(128450)}</p>
                <p className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-success">
                  <ArrowUpRight className="size-4" /> +18.4%
                </p>
              </div>
              <TrendAreaChart data={salesSeries} dataKey="sales" height={170} format={(v) => peso(v, { compact: true })} id="overview-sales" className="mt-2" />
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                <Stat label="Orders" value={128} />
                <Stat label="Pending fulfillment" value={pendingFulfillment + 13} />
                <Stat label="Low stock" value={state.products.filter((p) => p.status !== "draft" && p.variants.reduce((a, v) => a + v.stock, 0) <= p.lowStockThreshold).length} />
              </div>
            </SectionCard>
          )}
        </section>

        {/* AUTO CARE */}
        <section data-module="autocare" className="xl:col-span-3">
          {loading ? (
            <Skeleton className="h-[420px] rounded-2xl" />
          ) : (
            <SectionCard
              eyebrow="Auto Care"
              className="h-full"
              action={
                <Link to="/app/autocare" className="inline-flex items-center gap-1 text-sm font-medium text-module">
                  Open <ArrowUpRight className="size-4" />
                </Link>
              }
              bodyClassName="pt-2"
            >
              <p className="text-3xl font-semibold tracking-tight">
                21 <span className="text-base font-normal text-muted-foreground">vehicles today</span>
              </p>
              <div className="mt-3 flex gap-5 text-sm">
                <span>
                  <span className="tabular font-semibold">{completed}</span> <span className="text-muted-foreground">completed</span>
                </span>
                <span>
                  <span className="tabular font-semibold text-module">{Math.max(inProgress, 2) + 3}</span> <span className="text-muted-foreground">in progress</span>
                </span>
              </div>
              <p className="eyebrow mt-6 mb-2">Bays</p>
              <ul className="space-y-1.5">
                {state.bays.map((b) => {
                  const wo = state.workOrders.find((w) => w.id === b.currentWorkOrderId);
                  const vehicle = state.vehicles.find((v) => v.id === wo?.vehicleId);
                  return (
                    <li key={b.id} className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2">
                      <span className="font-mono text-xs text-muted-foreground">{b.number}</span>
                      <span className={cn("size-2 rounded-full", b.status === "busy" && "bg-module animate-pulse", b.status === "available" && "bg-success", b.status === "maintenance" && "bg-warning")} />
                      <span className="text-xs font-semibold uppercase tracking-wider">{b.status}</span>
                      {vehicle && (
                        <span className="ml-auto truncate text-xs text-muted-foreground">
                          {vehicle.make} {vehicle.model}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Link to="/app/autocare/bays" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-module">
                Manage bays <ArrowRight className="size-4" />
              </Link>
            </SectionCard>
          )}
        </section>
      </div>

      {/* Activity + upcoming */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard eyebrow="Activity" title="Across modules" bodyClassName="p-2 sm:p-3">
          <ul className="divide-y divide-border">
            {activity
              .slice()
              .sort((a, b) => b.at.localeCompare(a.at))
              .slice(0, 6)
              .map((a) => {
                const c = state.customers.find((x) => x.id === a.customerId);
                return (
                  <li key={a.id} data-module={a.module} className="flex items-center gap-3 px-3 py-3">
                    {c ? <InitialsAvatar name={c.name} /> : <span className="size-9 rounded-full bg-surface-2" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                    <span className="hidden size-1.5 rounded-full bg-module sm:block" />
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.at)}</span>
                  </li>
                );
              })}
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Next up" title="Today's schedule" bodyClassName="p-2 sm:p-3">
          <ul className="divide-y divide-border">
            {todayAppts
              .filter((a) => a.status !== "completed")
              .sort((a, b) => a.time.localeCompare(b.time))
              .slice(0, 4)
              .map((a) => {
                const v = state.vehicles.find((x) => x.id === a.vehicleId);
                const s = state.services.find((x) => x.id === a.serviceId);
                return (
                  <li key={a.id} data-module="autocare" className="flex items-center gap-3 px-3 py-3">
                    <span className="tabular w-16 text-sm font-semibold">{formatTime(a.time)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {v?.make} {v?.model}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{s?.name}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                );
              })}
            {upcoming.slice(0, 2).map((e) => (
              <li key={e.id} data-module="event" className="flex items-center gap-3 px-3 py-3">
                <span className="tabular w-16 text-sm font-semibold">{formatDate(e.date)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatTime(e.startTime)} · {e.venue}
                  </p>
                </div>
                <StatusBadge status="event" tone="module" label={`${eventSold(e)}/${e.capacity}`} dot={false} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
