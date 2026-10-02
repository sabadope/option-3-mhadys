import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, MetricSkeleton, PageHeader, Stat } from "@/components/kit";
import { BayCard } from "@/components/autocare/BayCard";
import { useApp } from "@/lib/store";
import { formatTime, TODAY } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export const Route = createFileRoute("/app/autocare/bays")({
  head: () => ({
    meta: [
      { title: "Bays — Auto Care — Nimbus" },
      { name: "description", content: "Live bay status, current vehicles, queue, and utilization." },
      { property: "og:title", content: "Bays — Auto Care — Nimbus" },
      { property: "og:description", content: "Visual bay management for your detailing studio." },
    ],
  }),
  component: Page,
});

function Page() {
  const { state, actions } = useApp();
  const loading = useSimulatedLoading(400);
  const [confirm, setConfirm] = useState<string | null>(null);

  const util = (bayId: string) => Math.min(1, state.appointments.filter((a) => a.date === TODAY && a.bayId === bayId && a.status !== "cancelled").reduce((s, a) => s + a.durationMinutes, 0) / 600);
  const nextQueued = (bayId: string) =>
    state.appointments.filter((a) => a.date === TODAY && a.bayId === bayId && ["booked", "confirmed", "arrived"].includes(a.status)).sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Auto Care" title="Bays" description="Live status across the studio floor." actions={<Button variant="secondary" asChild><Link to="/app/autocare/calendar">Open scheduler</Link></Button>} />
      <div className="surface grid grid-cols-3 gap-4 rounded-2xl p-5">
        <Stat label="Busy" value={state.bays.filter((b) => b.status === "busy").length} />
        <Stat label="Available" value={state.bays.filter((b) => b.status === "available").length} />
        <Stat label="Maintenance" value={state.bays.filter((b) => b.status === "maintenance").length} />
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <MetricSkeleton key={i} />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.bays.map((bay) => {
            const wo = state.workOrders.find((w) => w.id === bay.currentWorkOrderId);
            const v = state.vehicles.find((x) => x.id === wo?.vehicleId);
            const s = state.services.find((x) => x.id === wo?.serviceId);
            const st = state.staff.find((x) => x.id === wo?.staffId);
            const next = nextQueued(bay.id);
            const nv = state.vehicles.find((x) => x.id === next?.vehicleId);
            const headline = bay.status === "busy" && v ? `${v.make} ${v.model}` : bay.status === "available" ? "Available" : "Under maintenance";
            const subline = bay.status === "busy" && s ? `${s.name}${st ? ` · ${st.name}` : ""}${wo?.startedAt ? ` · since ${wo.startedAt.slice(11, 16)}` : ""}` : bay.status === "available" && next && nv ? `Next: ${nv.make} ${nv.model} at ${formatTime(next.time)}` : bay.status === "maintenance" ? "Lighting replacement until 3:00 PM" : "Nothing queued";
            return (
              <BayCard
                key={bay.id}
                bay={bay}
                large
                headline={headline}
                subline={subline}
                footer={
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>Today's utilization</span><span className="tabular">{Math.round(util(bay.id) * 100)}%</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-module" style={{ width: `${util(bay.id) * 100}%` }} /></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {wo && <Button size="sm" variant="subtle" asChild><Link to="/app/autocare/work-orders/$workOrderId" params={{ workOrderId: wo.id }}>Open work order</Link></Button>}
                      {bay.status !== "maintenance" && bay.status !== "busy" && <Button size="sm" variant="secondary" onClick={() => setConfirm(bay.id)}>Set maintenance</Button>}
                      {bay.status === "maintenance" && <Button size="sm" variant="secondary" onClick={() => { actions.setBayStatus(bay.id, "available"); toast.success(`Bay ${bay.number} is available again`); }}>Mark available</Button>}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Put bay under maintenance?"
        description="New appointments won't be scheduled into this bay until it's marked available."
        confirmLabel="Set maintenance"
        onConfirm={() => {
          if (confirm) {
            actions.setBayStatus(confirm, "maintenance");
            toast.success("Bay set to maintenance");
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}
