import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chip, EmptyState, InitialsAvatar, MetricSkeleton, PageHeader, StatusBadge } from "@/components/kit";
import { StaffCard } from "@/components/autocare/StaffCard";
import { useApp } from "@/lib/store";
import { formatTime, minutesToLabel, TODAY } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { StaffMember } from "@/types";

export const Route = createFileRoute("/app/autocare/staff")({
  head: () => ({
    meta: [
      { title: "Staff — Auto Care — Nimbus" },
      { name: "description", content: "Detailers, wash technicians, availability, and today's workload." },
      { property: "og:title", content: "Staff — Auto Care — Nimbus" },
      { property: "og:description", content: "Manage your auto care team and assignments." },
    ],
  }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const loading = useSimulatedLoading(400);
  const [filter, setFilter] = useState<StaffMember["status"] | "">("");
  const [selected, setSelected] = useState<StaffMember | null>(null);

  const todayJobs = (id: string) => state.appointments.filter((a) => a.date === TODAY && a.staffId === id && a.status !== "cancelled");
  const current = (id: string) => {
    const wo = state.workOrders.find((w) => w.staffId === id && w.status === "in_progress");
    const v = state.vehicles.find((x) => x.id === wo?.vehicleId);
    return v ? `${v.make} ${v.model}` : undefined;
  };
  const list = state.staff.filter((s) => (filter ? s.status === filter : true));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Auto Care" title="Staff" description={`${state.staff.filter((s) => s.status !== "off").length} on shift today · ${state.staff.filter((s) => s.status === "busy").length} currently on a job`} />
      <div className="flex w-fit gap-1 rounded-full bg-surface-2 p-1">
        <Chip selected={!filter} onClick={() => setFilter("")}>All</Chip>
        <Chip selected={filter === "available"} onClick={() => setFilter("available")}>Available</Chip>
        <Chip selected={filter === "busy"} onClick={() => setFilter("busy")}>Busy</Chip>
        <Chip selected={filter === "off"} onClick={() => setFilter("off")}>Off</Chip>
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <MetricSkeleton key={i} />)}</div>
      ) : list.length === 0 ? (
        <EmptyState title="No staff match" description="Try another status filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <StaffCard key={m.id} member={m} jobsToday={todayJobs(m.id).length} currentVehicle={current(m.id)} onClick={() => setSelected(m)} />
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="glass-strong w-full border-l sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={selected.name} size="lg" />
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.role} · {selected.shift}</p>
                  </div>
                </div>
              </SheetHeader>
              <p className="eyebrow mt-6 mb-2">Today's assignments</p>
              {todayJobs(selected.id).length === 0 ? (
                <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted-foreground">No jobs assigned today.</p>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {todayJobs(selected.id).sort((a, b) => a.time.localeCompare(b.time)).map((a) => {
                    const v = state.vehicles.find((x) => x.id === a.vehicleId);
                    const s = state.services.find((x) => x.id === a.serviceId);
                    const bay = state.bays.find((b) => b.id === a.bayId);
                    return (
                      <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="tabular w-16 text-sm font-semibold">{formatTime(a.time)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{v?.make} {v?.model}</p>
                          <p className="truncate text-xs text-muted-foreground">{s?.name} · {minutesToLabel(a.durationMinutes)}{bay ? ` · Bay ${bay.number}` : ""}</p>
                        </div>
                        <StatusBadge status={a.status} />
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link to="/app/autocare/calendar" className="mt-5 inline-block text-sm font-medium text-module">Open scheduler →</Link>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
