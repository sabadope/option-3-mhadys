import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable, FormField, inputClass, MetricCard, PageHeader, PersonCell, StatusBadge, TableSkeleton, type Column } from "@/components/kit";
import { useApp } from "@/lib/store";
import { formatDate, peso } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Customer } from "@/types";

export const Route = createFileRoute("/app/customers/")({
  head: () => ({
    meta: [
      { title: "Customers — Nimbus" },
      { name: "description", content: "One shared customer directory across events, merchandise, and auto care." },
      { property: "og:title", content: "Customers — Nimbus" },
      { property: "og:description", content: "Shared customers across all modules." },
    ],
  }),
  component: Page,
});

function Page() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "" });
  const [error, setError] = useState<string | null>(null);

  const spend = (id: string) =>
    state.bookings.filter((b) => b.customerId === id && b.status !== "cancelled").reduce((a, b) => a + b.amount, 0) +
    state.orders.filter((o) => o.customerId === id && o.status !== "cancelled").reduce((a, o) => a + o.total, 0) +
    state.appointments.filter((a) => a.customerId === id && a.status === "completed").reduce((a, x) => a + x.total, 0);

  const columns: Column<Customer>[] = [
    { key: "name", header: "Customer", cell: (c) => <PersonCell name={c.name} sub={c.email} /> },
    { key: "phone", header: "Phone", cell: (c) => <span className="text-muted-foreground">{c.phone}</span>, hideBelow: "lg" },
    { key: "city", header: "City", cell: (c) => c.city, hideBelow: "xl" },
    {
      key: "modules",
      header: "Active in",
      cell: (c) => (
        <div className="flex flex-wrap gap-1">
          {state.bookings.some((b) => b.customerId === c.id) && <StatusBadge status="event" label="Events" tone="info" dot={false} />}
          {state.orders.some((o) => o.customerId === c.id) && <StatusBadge status="merch" label="Merch" tone="warning" dot={false} />}
          {state.vehicles.some((v) => v.customerId === c.id) && <StatusBadge status="auto" label="Auto Care" tone="success" dot={false} />}
        </div>
      ),
    },
    { key: "spend", header: "Lifetime value", align: "right", cell: (c) => <span className="tabular font-medium">{peso(spend(c.id))}</span> },
    { key: "joined", header: "Since", cell: (c) => <span className="text-muted-foreground">{formatDate(c.joinedAt, "MMM yyyy")}</span>, hideBelow: "lg" },
  ];

  const submit = () => {
    if (!form.name.trim() || !form.email.includes("@")) return setError("Name and a valid email are required.");
    const c = actions.addCustomer(form);
    toast.success("Customer added", { description: c.name });
    setOpen(false);
    setForm({ name: "", email: "", phone: "", city: "" });
    setError(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform"
        title="Customers"
        description="One shared directory. Bookings, orders, and vehicles all roll up here."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus /> Add customer
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total customers" value={String(state.customers.length)} delta={6.4} hint="this month" />
        <MetricCard label="Multi-module" value={String(state.customers.filter((c) => [state.bookings.some((b) => b.customerId === c.id), state.orders.some((o) => o.customerId === c.id), state.vehicles.some((v) => v.customerId === c.id)].filter(Boolean).length > 1).length)} hint="use 2+ modules" />
        <MetricCard label="Avg lifetime value" value={peso(Math.round(state.customers.reduce((a, c) => a + spend(c.id), 0) / Math.max(state.customers.length, 1)))} />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          rows={state.customers}
          columns={columns}
          rowKey={(c) => c.id}
          searchable={(c) => `${c.name} ${c.email} ${c.phone} ${c.city}`}
          searchPlaceholder="Search customers…"
          onRowClick={(c) => navigate({ to: "/app/customers/$customerId", params: { customerId: c.id } })}
          empty={{ title: "No customers yet", description: "Customers appear here when they book, order, or bring in a vehicle.", icon: <Users /> }}
          renderCard={(c) => (
            <div className="flex items-center justify-between gap-3">
              <PersonCell name={c.name} sub={c.email} />
              <span className="tabular text-sm font-medium">{peso(spend(c.id))}</span>
            </div>
          )}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-3xl border">
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField label="Full name" htmlFor="c-name" required>
              <Input id="c-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Maria Santos" />
            </FormField>
            <FormField label="Email" htmlFor="c-email" required error={error ?? undefined}>
              <Input id="c-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="maria@example.com" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" htmlFor="c-phone">
                <Input id="c-phone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 9…" />
              </FormField>
              <FormField label="City" htmlFor="c-city">
                <Input id="c-city" className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Makati" />
              </FormField>
            </div>
            <Button onClick={submit} size="lg">
              Save customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
