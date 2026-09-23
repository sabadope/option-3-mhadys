import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Car, ReceiptText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, PageSkeleton, SectionCard, Stat, StatusBadge } from "@/components/kit";
import { VehicleBadge } from "@/components/autocare/VehicleBadge";
import { paintColor, serviceById } from "@/components/autocare/lib";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { formatDate, formatTime, peso, TODAY } from "@/lib/format";
import { serviceHistory } from "@/data/autocare";
import studio from "@/assets/autocare/studio.jpg";

export const Route = createFileRoute("/app/autocare/vehicles/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle Record — Auto Care" },
      { name: "description", content: "Digital service record for this vehicle." },
      { property: "og:title", content: "Vehicle Record — Auto Care" },
      { property: "og:description", content: "Full service history, spend, and upcoming bookings." },
    ],
  }),
  component: Page,
});

function Page() {
  const loading = useSimulatedLoading();
  const { vehicleId } = Route.useParams();
  const { state } = useApp();

  if (loading) return <PageSkeleton />;

  const vehicle = state.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) {
    return (
      <EmptyState
        title="Vehicle not found"
        description="This vehicle may have been removed."
        action={<Button asChild variant="module"><Link to="/app/autocare/vehicles">Back to vehicles</Link></Button>}
      />
    );
  }

  const owner = state.customers.find((c) => c.id === vehicle.customerId);
  const completedWO = state.workOrders.filter((w) => w.vehicleId === vehicle.id && w.status === "completed");
  const history = [
    ...serviceHistory.filter((h) => h.vehicleId === vehicle.id).map((h) => ({
      date: h.date,
      serviceName: serviceById(h.serviceId)?.name ?? "Service",
      staffName: state.staff.find((s) => s.id === h.staffId)?.name,
      amount: h.amount,
      source: "history" as const,
    })),
    ...completedWO.map((w) => ({
      date: w.completedAt?.slice(0, 10) ?? "",
      serviceName: serviceById(w.serviceId)?.name ?? "Service",
      staffName: state.staff.find((s) => s.id === w.staffId)?.name,
      amount: state.appointments.find((a) => a.id === w.appointmentId)?.total ?? serviceById(w.serviceId)?.price ?? 0,
      source: "workorder" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const upcoming = state.appointments
    .filter((a) => a.vehicleId === vehicle.id && a.date >= TODAY && a.status !== "cancelled" && a.status !== "completed")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const lifetimeSpend = history.reduce((sum, h) => sum + h.amount, 0);
  const nextAppointment = upcoming[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title={`${vehicle.make} ${vehicle.model}`}
        description={`${vehicle.year} · ${vehicle.plate}`}
        actions={
          <>
            <Button variant="ghost" asChild><Link to="/app/autocare/vehicles"><ArrowLeft /> Back</Link></Button>
            <Button variant="module" asChild><Link to="/app/autocare/appointments/new">Book service</Link></Button>
          </>
        }
      />

      <div className="relative overflow-hidden rounded-2xl">
        <img src={studio} alt="" className="h-32 w-full object-cover opacity-40 sm:h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 flex items-center gap-4 p-5 sm:p-6">
          <span className="size-10 shrink-0 rounded-full ring-2 ring-border" style={{ background: paintColor(vehicle.color) }} aria-hidden />
          <div className="min-w-0">
            <VehicleBadge vehicle={vehicle} />
            {owner && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                Owner: <Link to="/app/customers/$customerId" params={{ customerId: owner.id }} className="font-medium text-foreground hover:underline">{owner.name}</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {vehicle.notes && (
        <div className="surface flex items-start gap-3 rounded-2xl p-4 text-sm">
          <Wrench className="mt-0.5 size-4 shrink-0 text-module" />
          <p className="text-muted-foreground">{vehicle.notes}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        <SectionCard><Stat label="Visits" value={history.length} /></SectionCard>
        <SectionCard><Stat label="Lifetime spend" value={peso(lifetimeSpend)} /></SectionCard>
        <SectionCard><Stat label="Last service" value={history[0] ? formatDate(history[0].date) : "—"} /></SectionCard>
        <SectionCard><Stat label="Next appointment" value={nextAppointment ? formatDate(nextAppointment.date) : "None"} /></SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Service history" eyebrow="Digital record">
          {history.length === 0 ? (
            <EmptyState title="No service history yet" description="Completed services will appear here." icon={<ReceiptText />} />
          ) : (
            <ul className="divide-y divide-border">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{h.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(h.date)} {h.staffName ? `· ${h.staffName}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="tabular text-sm font-medium">{peso(h.amount)}</span>
                    <StatusBadge status="completed" dot={false} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Upcoming appointments" eyebrow="Scheduled">
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing booked" description="Schedule a new service for this vehicle." icon={<CalendarClock />} />
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{serviceById(a.serviceId)?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(a.date)} · {formatTime(a.time)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
