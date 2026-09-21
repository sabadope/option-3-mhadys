import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CalendarClock, CheckCircle2, Gauge, TrendingUp } from "lucide-react";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { PageHeader, MetricCard, SectionCard, PageSkeleton, SimpleBarChart, StatusBadge, EmptyState } from "@/components/kit";
import { BayCard } from "@/components/autocare/BayCard";
import { StaffCard } from "@/components/autocare/StaffCard";
import { VehicleBadge } from "@/components/autocare/VehicleBadge";
import { checklistProgress, serviceById } from "@/components/autocare/lib";
import { autocareSeries } from "@/data/autocare";
import { peso, formatTime, NOW, TODAY, humanize } from "@/lib/format";
import { Button } from "@/components/ui/button";
import studio from "@/assets/autocare/studio.jpg";

export const Route = createFileRoute("/app/autocare/")({
  head: () => ({
    meta: [
      { title: "Auto Care Overview — Nimbus" },
      { name: "description", content: "Live operations dashboard for your car wash and detailing bays." },
      { property: "og:title", content: "Auto Care Overview — Nimbus" },
      { property: "og:description", content: "Bays, active jobs, upcoming appointments, and staff workload at a glance." },
    ],
  }),
  component: AutocareDashboard,
});

const completedEarlier = 14;

function AutocareDashboard() {
  const loading = useSimulatedLoading();
  const { state } = useApp();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  const todays = state.appointments.filter((a) => a.date === TODAY);
  const completedToday = todays.filter((a) => a.status === "completed").length;
  const inProgress = todays.filter((a) => a.status === "in_progress").length;
  const revenueToday = todays.reduce((sum, a) => sum + a.total, 0);

  const activeWorkOrders = state.workOrders
    .filter((w) => ["in_progress", "arrived", "in_queue"].includes(w.status))
    .slice(0, 6);

  const upcoming = todays
    .filter((a) => a.time > "10:15" && (a.status === "booked" || a.status === "confirmed"))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 6);

  const staffWithJobs = state.staff.map((s) => ({ staff: s, jobs: todays.filter((a) => a.staffId === s.id).length }));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Auto Care" title="Today's operations" description="Live status across bays, staff, and today's vehicles." atmosphere />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <img src={studio} alt="" className="h-40 w-full object-cover sm:h-52" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:p-6">
          <HeroStat label="Vehicles" value={String(todays.length)} />
          <HeroStat label="Revenue" value={peso(revenueToday)} />
          <HeroStat label="Completed" value={String(completedEarlier + completedToday)} />
          <HeroStat label="In Progress" value={String(inProgress)} />
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {state.bays.map((bay) => {
          const wo = state.workOrders.find((w) => w.id === bay.currentWorkOrderId);
          const vehicle = wo && state.vehicles.find((v) => v.id === wo.vehicleId);
          const service = wo && serviceById(wo.serviceId);
          const staff = wo?.staffId ? state.staff.find((s) => s.id === wo.staffId) : undefined;
          return (
            <BayCard
              key={bay.id}
              bay={bay}
              headline={vehicle ? `${vehicle.make} ${vehicle.model}` : bay.status === "available" ? "Available" : undefined}
              subline={service ? `${service.name} · ${staff?.name ?? "Unassigned"}` : undefined}
            />
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Active jobs" eyebrow="Work orders" action={<Link to="/app/autocare/work-orders" className="text-xs font-medium text-module">View all</Link>}>
          {activeWorkOrders.length === 0 ? (
            <EmptyState title="No active jobs" description="All vehicles are checked in or completed." />
          ) : (
            <ul className="space-y-3">
              {activeWorkOrders.map((wo) => {
                const vehicle = state.vehicles.find((v) => v.id === wo.vehicleId);
                const service = serviceById(wo.serviceId);
                const progress = checklistProgress(wo);
                return (
                  <li key={wo.id}>
                    <Link to="/app/autocare/work-orders/$workOrderId" params={{ workOrderId: wo.id }} className="flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-accent/40">
                      {vehicle && <VehicleBadge vehicle={vehicle} size="sm" className="flex-1" />}
                      <div className="w-24 shrink-0 text-right">
                        <p className="text-xs text-muted-foreground truncate">{service?.name}</p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full rounded-full bg-module" style={{ width: `${progress * 100}%` }} />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Upcoming appointments" eyebrow="Today, after 10:15 AM" action={<Link to="/app/autocare/appointments" className="text-xs font-medium text-module">View all</Link>}>
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled" description="No more appointments booked for later today." icon={<CalendarClock />} />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => {
                const vehicle = state.vehicles.find((v) => v.id === a.vehicleId);
                const service = serviceById(a.serviceId);
                return (
                  <li key={a.id} className="flex items-center gap-3">
                    <div className="w-14 shrink-0 text-sm font-semibold tabular">{formatTime(a.time)}</div>
                    {vehicle && <VehicleBadge vehicle={vehicle} size="sm" className="flex-1" />}
                    <span className="text-xs text-muted-foreground">{service?.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Staff workload" eyebrow="Today">
          <div className="space-y-3">
            {staffWithJobs.map(({ staff, jobs }) => (
              <div key={staff.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-sm">{staff.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-module" style={{ width: `${Math.min(100, (jobs / 5) * 100)}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-xs tabular text-muted-foreground">{jobs}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Vehicles served" eyebrow="Last 7 days" action={<TrendingUp className="size-4 text-muted-foreground" />}>
          <SimpleBarChart data={autocareSeries} dataKey="vehicles" height={200} />
        </SectionCard>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="tabular text-lg font-semibold sm:text-xl">{value}</p>
    </div>
  );
}
