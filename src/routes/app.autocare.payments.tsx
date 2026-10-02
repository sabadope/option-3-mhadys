import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, MetricCard, PageHeader, PaymentPanel, PersonCell, StatusBadge, TableSkeleton, type Column } from "@/components/kit";
import { useApp } from "@/lib/store";
import { formatDateTime, humanize, peso } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Payment } from "@/types";

export const Route = createFileRoute("/app/autocare/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Auto Care — Nimbus" },
      { name: "description", content: "Collected payments, deposits held, and outstanding balances for auto care work orders." },
      { property: "og:title", content: "Payments — Auto Care — Nimbus" },
      { property: "og:description", content: "Track and collect auto care payments." },
    ],
  }),
  component: Page,
});

function Page() {
  const { state, actions } = useApp();
  const loading = useSimulatedLoading(400);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rows = state.payments.filter((p) => p.module === "autocare").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const selected = rows.find((p) => p.id === selectedId) ?? null;
  const name = (id: string) => state.customers.find((c) => c.id === id)?.name ?? "—";
  const collectedToday = rows.filter((p) => p.createdAt.startsWith("2026-09-18") && p.status === "paid").reduce((s, p) => s + p.total, 0);

  const columns: Column<Payment>[] = [
    { key: "ref", header: "Reference", cell: (p) => <span className="font-mono text-xs">{p.referenceCode}</span> },
    { key: "c", header: "Customer", cell: (p) => <PersonCell name={name(p.customerId)} size="sm" /> },
    { key: "m", header: "Method", cell: (p) => humanize(p.method), hideBelow: "lg" },
    { key: "t", header: "Total", align: "right", cell: (p) => <span className="tabular">{peso(p.total)}</span> },
    { key: "d", header: "Deposit", align: "right", cell: (p) => <span className="tabular text-muted-foreground">{p.deposit ? peso(p.deposit) : "—"}</span>, hideBelow: "xl" },
    { key: "b", header: "Balance", align: "right", cell: (p) => <span className={p.balance > 0 ? "tabular font-medium text-warning" : "tabular text-muted-foreground"}>{peso(p.balance)}</span> },
    { key: "s", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "at", header: "Date", cell: (p) => <span className="text-muted-foreground">{formatDateTime(p.createdAt)}</span>, hideBelow: "lg" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Auto Care" title="Payments" description="Cash, card, and online payments for work orders." />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Collected today" value={peso(collectedToday + 18150)} delta={9.2} />
        <MetricCard label="Outstanding balance" value={peso(rows.reduce((s, p) => s + p.balance, 0))} hint={`${rows.filter((p) => p.balance > 0).length} open`} />
        <MetricCard label="Deposits held" value={peso(rows.filter((p) => p.status === "partial").reduce((s, p) => s + p.deposit, 0))} />
      </div>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(p) => p.id}
          searchable={(p) => `${p.referenceCode} ${name(p.customerId)} ${p.method}`}
          filters={[{ key: "status", label: "Status", options: [{ value: "paid", label: "Paid" }, { value: "partial", label: "Partial" }, { value: "unpaid", label: "Unpaid" }] }]}
          filterFn={(p, f) => !f.status || p.status === f.status}
          onRowClick={(p) => setSelectedId(p.id)}
          empty={{ title: "No payments yet", description: "Payments appear here once work orders are collected." }}
          renderCard={(p) => (
            <div className="flex items-center justify-between gap-3">
              <div><p className="font-mono text-xs">{p.referenceCode}</p><p className="text-sm font-medium">{name(p.customerId)}</p></div>
              <div className="text-right"><p className="tabular text-sm font-medium">{peso(p.total)}</p><StatusBadge status={p.status} /></div>
            </div>
          )}
        />
      )}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="glass-strong w-full border-l sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>{selected.referenceCode}</SheetTitle>
                <p className="text-sm text-muted-foreground">{name(selected.customerId)} · {formatDateTime(selected.createdAt)}</p>
              </SheetHeader>
              <div className="mt-6">
                <PaymentPanel
                  summary={{ subtotal: selected.subtotal, discount: selected.discount, tax: selected.tax, deposit: selected.deposit, total: selected.total, balance: selected.balance, status: selected.status }}
                  defaultMethod={selected.method}
                  ctaLabel={`Collect ${peso(selected.balance)}`}
                  onPay={
                    selected.balance > 0
                      ? (method) => {
                          actions.recordPayment({ module: "autocare", referenceId: selected.referenceId, referenceCode: selected.referenceCode, customerId: selected.customerId, subtotal: selected.subtotal, discount: selected.discount, tax: selected.tax, deposit: selected.deposit, total: selected.total, method, amountPaid: selected.balance });
                          toast.success("Payment collected", { description: `${selected.referenceCode} · ${peso(selected.balance)} via ${humanize(method)}` });
                        }
                      : undefined
                  }
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
