import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatDateTime, peso } from "@/lib/format";
import { PageHeader, DataTable, PersonCell, StatusBadge, ConfirmDialog, PaymentPanel, type Column, type FilterDef } from "@/components/kit";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types";

export const Route = createFileRoute("/app/events/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — Nimbus" },
      { name: "description", content: "Review, confirm, and manage every event booking." },
      { property: "og:title", content: "Bookings — Nimbus" },
      { property: "og:description", content: "All bookings in one place." },
    ],
  }),
  component: EventsBookings,
});

function EventsBookings() {
  const { state, actions } = useApp();
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const eventOptions: FilterDef["options"] = state.events.map((e) => ({ value: e.id, label: e.name }));
  const filters: FilterDef[] = [
    { key: "status", label: "Status", options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "checked_in", label: "Checked in" },
      { value: "cancelled", label: "Cancelled" },
    ] },
    { key: "event", label: "Event", options: eventOptions },
  ];

  const selectedEvent = selected ? state.events.find((e) => e.id === selected.eventId) : undefined;
  const selectedCustomer = selected ? state.customers.find((c) => c.id === selected.customerId) : undefined;
  const selectedTicket = selected && selectedEvent ? selectedEvent.ticketTypes.find((t) => t.id === selected.ticketTypeId) : undefined;

  const columns: Column<Booking>[] = [
    { key: "code", header: "Booking", cell: (b) => <span className="tabular font-medium">{b.code}</span> },
    {
      key: "customer",
      header: "Customer",
      cell: (b) => {
        const c = state.customers.find((x) => x.id === b.customerId);
        return <PersonCell name={c?.name ?? "Guest"} sub={c?.email} size="sm" />;
      },
    },
    { key: "event", header: "Event", cell: (b) => state.events.find((e) => e.id === b.eventId)?.name ?? "—", hideBelow: "lg" },
    { key: "ticket", header: "Ticket", cell: (b) => state.events.find((e) => e.id === b.eventId)?.ticketTypes.find((t) => t.id === b.ticketTypeId)?.name ?? "—", hideBelow: "xl" },
    { key: "qty", header: "Qty", cell: (b) => b.quantity, hideBelow: "lg" },
    { key: "amount", header: "Amount", cell: (b) => peso(b.amount), align: "right" },
    { key: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
    { key: "date", header: "Date", cell: (b) => formatDateTime(b.createdAt), hideBelow: "xl" },
  ];

  const confirmBooking = (b: Booking) => {
    actions.updateBookingStatus(b.id, "confirmed");
    toast.success(`${b.code} confirmed.`);
    setSelected((s) => (s?.id === b.id ? { ...s, status: "confirmed" } : s));
  };

  const cancelBooking = () => {
    if (!selected) return;
    actions.updateBookingStatus(selected.id, "cancelled");
    toast("Booking cancelled.");
    setSelected((s) => (s ? { ...s, status: "cancelled" } : s));
    setCancelOpen(false);
  };

  const recordAndConfirm = () => {
    if (!selected || !selectedCustomer) return;
    actions.recordPayment({
      module: "event",
      referenceId: selected.id,
      referenceCode: selected.code,
      customerId: selected.customerId,
      subtotal: selected.amount,
      discount: 0,
      tax: 0,
      deposit: 0,
      total: selected.amount,
      method: selected.paymentMethod,
      amountPaid: selected.amount,
    });
    actions.updateBookingStatus(selected.id, "confirmed");
    setSelected((s) => (s ? { ...s, status: "confirmed" } : s));
    toast.success("Payment recorded — booking confirmed.");
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="Bookings" description="Track and manage every ticket booking." />

      <DataTable
        rows={state.bookings}
        columns={columns}
        rowKey={(b) => b.id}
        onRowClick={setSelected}
        searchable={(b) => `${b.code} ${state.customers.find((c) => c.id === b.customerId)?.name ?? ""}`}
        searchPlaceholder="Search bookings…"
        filters={filters}
        filterFn={(b, active) => (!active.status || b.status === active.status) && (!active.event || b.eventId === active.event)}
        empty={{ title: "No bookings yet" }}
        renderCard={(b) => {
          const c = state.customers.find((x) => x.id === b.customerId);
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <PersonCell name={c?.name ?? "Guest"} sub={b.code} size="sm" />
                <StatusBadge status={b.status} />
              </div>
              <p className="text-xs text-muted-foreground">{state.events.find((e) => e.id === b.eventId)?.name}</p>
              <p className="tabular text-sm font-medium">{peso(b.amount)}</p>
            </div>
          );
        }}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="glass-strong border-l overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="tracking-tight">{selected.code}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <StatusBadge status={selected.status} />
                <PersonCell name={selectedCustomer?.name ?? "Guest"} sub={selectedCustomer?.email} />
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Event</dt><dd className="mt-0.5 font-medium">{selectedEvent?.name ?? "—"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Ticket</dt><dd className="mt-0.5 font-medium">{selectedTicket?.name ?? "—"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Quantity</dt><dd className="mt-0.5 font-medium">{selected.quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Booked</dt><dd className="mt-0.5 font-medium">{formatDateTime(selected.createdAt)}</dd></div>
                </dl>

                {selected.status === "pending" ? (
                  <PaymentPanel
                    summary={{ subtotal: selected.amount, total: selected.amount, status: "unpaid" }}
                    onPay={recordAndConfirm}
                    ctaLabel={`Collect ${peso(selected.amount)}`}
                  />
                ) : (
                  <PaymentPanel summary={{ subtotal: selected.amount, total: selected.amount, status: "paid" }} />
                )}

                {selected.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "pending" && (
                      <Button variant="module" onClick={() => confirmBooking(selected)}>
                        <CheckCircle2 className="size-4" /> Confirm booking
                      </Button>
                    )}
                    <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                      <XCircle className="size-4" /> Cancel booking
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this booking?"
        description="This will mark the booking as cancelled. This can't be undone."
        confirmLabel="Cancel booking"
        destructive
        onConfirm={cancelBooking}
      />
    </div>
  );
}
