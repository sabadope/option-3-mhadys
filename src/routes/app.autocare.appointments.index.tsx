import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, PersonCell, StatusBadge, PageHeader, ConfirmDialog, TableSkeleton, type Column } from "@/components/kit";
import { VehicleBadge } from "@/components/autocare/VehicleBadge";
import { serviceById } from "@/components/autocare/lib";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { formatDate, formatTime, minutesToLabel, peso, TODAY } from "@/lib/format";
import type { Appointment } from "@/types";

export const Route = createFileRoute("/app/autocare/appointments/")({
  head: () => ({
    meta: [
      { title: "Appointments — Auto Care" },
      { name: "description", content: "Manage upcoming and past auto care appointments." },
      { property: "og:title", content: "Appointments — Auto Care" },
      { property: "og:description", content: "Book, confirm, and track vehicle appointments." },
    ],
  }),
  component: Page,
});

type Tab = "today" | "upcoming" | "past" | "all";

function Page() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const [tab, setTab] = useState<Tab>("today");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const byTab = useMemo(() => {
    return state.appointments.filter((a) => {
      if (tab === "today") return a.date === TODAY;
      if (tab === "upcoming") return a.date > TODAY;
      if (tab === "past") return a.date < TODAY;
      return true;
    });
  }, [state.appointments, tab]);

  const columns: Column<Appointment>[] = [
    { key: "code", header: "Code", cell: (a) => <span className="font-mono text-xs font-semibold">{a.code}</span> },
    {
      key: "customer",
      header: "Customer",
      cell: (a) => {
        const c = state.customers.find((x) => x.id === a.customerId);
        return <PersonCell name={c?.name ?? "—"} sub={c?.phone} />;
      },
    },
    {
      key: "vehicle",
      header: "Vehicle",
      cell: (a) => {
        const v = state.vehicles.find((x) => x.id === a.vehicleId);
        return v ? <VehicleBadge vehicle={v} size="sm" /> : "—";
      },
      hideBelow: "lg",
    },
    { key: "service", header: "Service", cell: (a) => serviceById(a.serviceId)?.name ?? "—", hideBelow: "lg" },
    { key: "when", header: "Date / Time", cell: (a) => `${formatDate(a.date)} · ${formatTime(a.time)}` },
    { key: "duration", header: "Duration", cell: (a) => minutesToLabel(a.durationMinutes), hideBelow: "xl" },
    {
      key: "bay",
      header: "Bay",
      cell: (a) => {
        const bay = state.bays.find((b) => b.id === a.bayId);
        return bay ? `Bay ${bay.number}` : "—";
      },
      hideBelow: "xl",
    },
    {
      key: "staff",
      header: "Staff",
      cell: (a) => state.staff.find((s) => s.id === a.staffId)?.name ?? "—",
      hideBelow: "xl",
    },
    { key: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
    { key: "total", header: "Total", align: "right", cell: (a) => <span className="tabular font-medium">{peso(a.total)}</span> },
  ];

  const relatedWorkOrder = (a: Appointment) => state.workOrders.find((w) => w.appointmentId === a.id);

  const confirm = (a: Appointment) => {
    actions.updateAppointment(a.id, { status: "confirmed" });
    toast.success(`${a.code} confirmed`);
    setSelected({ ...a, status: "confirmed" });
  };

  const markArrived = (a: Appointment) => {
    const wo = relatedWorkOrder(a);
    if (!wo) return;
    let cur = wo.status;
    const order: typeof cur[] = ["booked", "confirmed", "arrived"];
    let idx = order.indexOf(cur);
    while (idx >= 0 && idx < order.length - 1) {
      actions.advanceWorkOrder(wo.id);
      idx += 1;
    }
    toast.success(`${a.code} marked arrived`);
    setSelected({ ...a, status: "arrived" });
  };

  const cancel = (a: Appointment) => {
    actions.updateAppointment(a.id, { status: "cancelled" });
    toast.success(`${a.code} cancelled`);
    setCancelOpen(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="Appointments"
        description="Every booking across your bays, from intake to completion."
        actions={
          <Button variant="module" onClick={() => navigate({ to: "/app/autocare/appointments/new" })}>
            <Plus /> New appointment
          </Button>
        }
      />

      <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1 w-fit">
        {(["today", "upcoming", "past", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-8 rounded-full px-4 text-xs font-medium capitalize transition-colors ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          rows={byTab}
          columns={columns}
          rowKey={(a) => a.id}
          searchable={(a) => {
            const c = state.customers.find((x) => x.id === a.customerId);
            const v = state.vehicles.find((x) => x.id === a.vehicleId);
            return `${a.code} ${c?.name ?? ""} ${v?.plate ?? ""} ${v?.model ?? ""}`;
          }}
          searchPlaceholder="Search appointments…"
          filters={[
            {
              key: "status",
              label: "Status",
              options: ["booked", "confirmed", "arrived", "in_progress", "completed", "cancelled"].map((s) => ({ value: s, label: s.replace("_", " ") })),
            },
          ]}
          filterFn={(a, active) => !active.status || a.status === active.status}
          onRowClick={(a) => setSelected(a)}
          empty={{ title: "No appointments scheduled for today.", description: "New bookings will show up here.", icon: <CalendarClock /> }}
        />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="glass-strong w-full max-w-md overflow-y-auto rounded-l-3xl border">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono">{selected.code}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 px-1">
                <div className="flex items-center justify-between">
                  <StatusBadge status={selected.status} />
                  <span className="tabular text-lg font-semibold">{peso(selected.total)}</span>
                </div>
                {(() => {
                  const v = state.vehicles.find((x) => x.id === selected.vehicleId);
                  return v ? <VehicleBadge vehicle={v} /> : null;
                })()}
                <div className="surface rounded-xl p-3 text-sm space-y-1.5">
                  <p><span className="text-muted-foreground">Service:</span> {serviceById(selected.serviceId)?.name}</p>
                  <p><span className="text-muted-foreground">When:</span> {formatDate(selected.date)} · {formatTime(selected.time)}</p>
                  <p><span className="text-muted-foreground">Staff:</span> {state.staff.find((s) => s.id === selected.staffId)?.name ?? "Unassigned"}</p>
                  <p><span className="text-muted-foreground">Bay:</span> {state.bays.find((b) => b.id === selected.bayId)?.number ?? "—"}</p>
                </div>
                <div className="grid gap-2">
                  {selected.status === "booked" && (
                    <Button variant="module" onClick={() => confirm(selected)}>Confirm appointment</Button>
                  )}
                  {(selected.status === "booked" || selected.status === "confirmed") && (
                    <Button variant="secondary" onClick={() => markArrived(selected)}>Mark vehicle arrived</Button>
                  )}
                  {relatedWorkOrder(selected) && (
                    <Button variant="outline" asChild>
                      <Link to="/app/autocare/work-orders/$workOrderId" params={{ workOrderId: relatedWorkOrder(selected)!.id }}>View work order</Link>
                    </Button>
                  )}
                  {selected.status !== "cancelled" && selected.status !== "completed" && (
                    <Button variant="destructive" onClick={() => setCancelOpen(true)}>Cancel appointment</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel appointment?"
        description="This will mark the appointment as cancelled. This cannot be undone."
        confirmLabel="Cancel appointment"
        destructive
        onConfirm={() => selected && cancel(selected)}
      />
    </div>
  );
}
