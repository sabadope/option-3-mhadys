import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageSkeleton, EmptyState } from "@/components/kit";
import { WorkOrderCard } from "@/components/autocare/WorkOrderCard";
import { serviceById } from "@/components/autocare/lib";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { WorkOrder, WorkOrderStatus } from "@/types";

export const Route = createFileRoute("/app/autocare/work-orders/")({
  head: () => ({
    meta: [
      { title: "Work Orders — Auto Care" },
      { name: "description", content: "Track vehicles through the service pipeline." },
      { property: "og:title", content: "Work Orders — Auto Care" },
      { property: "og:description", content: "Board and list views of every active and completed job." },
    ],
  }),
  component: Page,
});

const COLUMNS: { key: WorkOrderStatus[]; label: string }[] = [
  { key: ["booked", "confirmed"], label: "Booked / Confirmed" },
  { key: ["arrived", "in_queue"], label: "Arrived / In queue" },
  { key: ["in_progress"], label: "In progress" },
  { key: ["quality_check"], label: "Quality check" },
  { key: ["completed"], label: "Completed" },
];

function Page() {
  const { state } = useApp();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const [view, setView] = useState<"board" | "list">("board");

  if (loading) return <PageSkeleton />;

  const goto = (wo: WorkOrder) => navigate({ to: "/app/autocare/work-orders/$workOrderId", params: { workOrderId: wo.id } });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="Work orders"
        description="Every vehicle moving through your service pipeline."
        actions={
          <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1">
            <Button size="sm" variant={view === "board" ? "default" : "ghost"} className="rounded-full" onClick={() => setView("board")}><LayoutGrid /> Board</Button>
            <Button size="sm" variant={view === "list" ? "default" : "ghost"} className="rounded-full" onClick={() => setView("list")}><List /> List</Button>
          </div>
        }
      />

      {state.workOrders.length === 0 ? (
        <EmptyState title="No work orders yet" description="Booked appointments generate a work order automatically." />
      ) : view === "board" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = state.workOrders.filter((w) => col.key.includes(w.status));
            return (
              <div key={col.label} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.label}</h3>
                  <span className="tabular text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map((wo) => (
                    <WorkOrderCard
                      key={wo.id}
                      wo={wo}
                      vehicle={state.vehicles.find((v) => v.id === wo.vehicleId)}
                      service={serviceById(wo.serviceId)}
                      staff={state.staff.find((s) => s.id === wo.staffId)}
                      bay={state.bays.find((b) => b.id === wo.bayId)}
                      onClick={() => goto(wo)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {state.workOrders.map((wo) => (
            <WorkOrderCard
              key={wo.id}
              wo={wo}
              vehicle={state.vehicles.find((v) => v.id === wo.vehicleId)}
              service={serviceById(wo.serviceId)}
              staff={state.staff.find((s) => s.id === wo.staffId)}
              bay={state.bays.find((b) => b.id === wo.bayId)}
              onClick={() => goto(wo)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
