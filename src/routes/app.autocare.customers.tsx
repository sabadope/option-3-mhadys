import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Car } from "lucide-react";
import { DataTable, PageHeader, PersonCell, TableSkeleton, type Column } from "@/components/kit";
import { useApp } from "@/lib/store";
import { formatDate, peso } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Customer } from "@/types";

export const Route = createFileRoute("/app/autocare/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Auto Care — Nimbus" },
      { name: "description", content: "Vehicle owners, visits, and lifetime spend at your detailing studio." },
      { property: "og:title", content: "Customers — Auto Care — Nimbus" },
      { property: "og:description", content: "Auto care customers and their vehicles." },
    ],
  }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const rows = state.customers.filter((c) => state.vehicles.some((v) => v.customerId === c.id));
  const visits = (id: string) => state.appointments.filter((a) => a.customerId === id && a.status === "completed");
  const spend = (id: string) => visits(id).reduce((s, a) => s + a.total, 0);
  const last = (id: string) => visits(id).sort((a, b) => b.date.localeCompare(a.date))[0];

  const columns: Column<Customer>[] = [
    { key: "c", header: "Customer", cell: (c) => <PersonCell name={c.name} sub={c.phone} /> },
    {
      key: "v",
      header: "Vehicles",
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {state.vehicles.filter((v) => v.customerId === c.id).map((v) => (
            <span key={v.id} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">{v.make} {v.model}</span>
          ))}
        </div>
      ),
    },
    { key: "n", header: "Visits", align: "right", cell: (c) => <span className="tabular">{visits(c.id).length}</span> },
    { key: "s", header: "Lifetime spend", align: "right", cell: (c) => <span className="tabular font-medium">{peso(spend(c.id))}</span> },
    { key: "l", header: "Last visit", cell: (c) => <span className="text-muted-foreground">{last(c.id) ? formatDate(last(c.id)!.date, "MMM d, yyyy") : "—"}</span>, hideBelow: "lg" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Auto Care" title="Customers" description="Everyone with a vehicle on file." />
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(c) => c.id}
          searchable={(c) => `${c.name} ${c.phone} ${state.vehicles.filter((v) => v.customerId === c.id).map((v) => `${v.make} ${v.model} ${v.plate}`).join(" ")}`}
          searchPlaceholder="Search by name, vehicle, or plate…"
          onRowClick={(c) => navigate({ to: "/app/customers/$customerId", params: { customerId: c.id } })}
          empty={{ title: "No vehicle owners yet", description: "Add a vehicle to a customer to see them here.", icon: <Car /> }}
          renderCard={(c) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3"><PersonCell name={c.name} sub={c.phone} /><span className="tabular text-sm font-medium">{peso(spend(c.id))}</span></div>
              <div className="flex flex-wrap gap-1">{state.vehicles.filter((v) => v.customerId === c.id).map((v) => <span key={v.id} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">{v.make} {v.model}</span>)}</div>
            </div>
          )}
        />
      )}
    </div>
  );
}
