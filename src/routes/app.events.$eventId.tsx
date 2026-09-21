import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, MapPin, QrCode, Ticket as TicketIcon } from "lucide-react";
import { useApp, eventRevenue, eventSold } from "@/lib/store";
import { formatDate, formatTime, peso } from "@/lib/format";
import { PageHeader, SectionCard, StatusBadge, MetricCard, EmptyState, PersonCell, DataTable, type Column } from "@/components/kit";
import { CapacityBar } from "@/components/events/CapacityBar";
import { Button } from "@/components/ui/button";
import type { Booking, Attendee } from "@/types";

export const Route = createFileRoute("/app/events/$eventId")({
  head: () => ({
    meta: [
      { title: "Event Detail — Nimbus" },
      { name: "description", content: "View event performance, tickets, bookings, and attendees." },
      { property: "og:title", content: "Event Detail — Nimbus" },
      { property: "og:description", content: "Everything about this event in one place." },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const event = state.events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <EmptyState
        title="Event not found"
        description="This event may have been removed."
        action={
          <Button onClick={() => navigate({ to: "/app/events/list" })} variant="module">
            Back to events
          </Button>
        }
      />
    );
  }

  const sold = eventSold(event);
  const revenue = eventRevenue(event);
  const sellThrough = event.capacity > 0 ? Math.round((sold / event.capacity) * 100) : 0;
  const bookings = state.bookings.filter((b) => b.eventId === event.id);
  const attendees = state.attendees.filter((a) => a.eventId === event.id);
  const checkedIn = attendees.filter((a) => a.checkedIn).length;
  const checkInRate = attendees.length > 0 ? Math.round((checkedIn / attendees.length) * 100) : 0;

  const togglePublish = () => {
    setBusy(true);
    const next = event.status === "published" ? "draft" : "published";
    setTimeout(() => {
      actions.updateEvent(event.id, { status: next });
      toast.success(next === "published" ? "Event published." : "Event unpublished.");
      setBusy(false);
    }, 400);
  };

  const bookingColumns: Column<Booking>[] = [
    { key: "code", header: "Booking", cell: (b) => <span className="tabular font-medium">{b.code}</span> },
    {
      key: "customer",
      header: "Customer",
      cell: (b) => {
        const c = state.customers.find((x) => x.id === b.customerId);
        return <PersonCell name={c?.name ?? "Guest"} size="sm" />;
      },
    },
    { key: "qty", header: "Qty", cell: (b) => b.quantity, hideBelow: "lg" },
    { key: "amount", header: "Amount", cell: (b) => peso(b.amount), align: "right" },
    { key: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
  ];

  const attendeeColumns: Column<Attendee>[] = [
    { key: "name", header: "Attendee", cell: (a) => <PersonCell name={a.name} sub={a.email} size="sm" /> },
    {
      key: "ticket",
      header: "Ticket",
      cell: (a) => event.ticketTypes.find((t) => t.id === a.ticketTypeId)?.name ?? "—",
      hideBelow: "lg",
    },
    { key: "status", header: "Status", cell: (a) => (a.checkedIn ? <StatusBadge status="checked_in" label="Checked in" /> : <StatusBadge status="pending" label="Not yet" />) },
  ];

  return (
    <div className="space-y-6">
      <div className="module-atmosphere -mx-4 overflow-hidden rounded-b-3xl sm:-mx-8">
        <div className="relative h-56 w-full sm:h-72">
          <img src={event.coverImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 sm:inset-x-8 sm:bottom-6">
            <StatusBadge status={event.status} />
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{event.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4" /> {formatDate(event.date, "EEEE, MMM d, yyyy")} · {formatTime(event.startTime)}–{formatTime(event.endTime)}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="module" onClick={togglePublish} disabled={busy}>
          {event.status === "published" ? "Unpublish" : "Publish"}
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/app/events/checkin"><QrCode className="size-4" /> Open check-in</Link>
        </Button>
        <Button variant="outline" asChild>
          <a href={`/book/${event.id}`} target="_blank" rel="noreferrer">View public booking page</a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenue" value={peso(revenue, { compact: true })} icon={<TicketIcon />} />
        <MetricCard label="Sell-through" value={`${sellThrough}%`} hint={`${sold} / ${event.capacity}`} />
        <MetricCard label="Check-in rate" value={`${checkInRate}%`} hint={`${checkedIn} / ${attendees.length}`} />
        <MetricCard label="Bookings" value={String(bookings.length)} />
      </div>

      <SectionCard eyebrow="Key facts" title="About this event">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div><dt className="text-xs text-muted-foreground">Category</dt><dd className="mt-0.5 font-medium">{event.category}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Address</dt><dd className="mt-0.5 font-medium">{event.address}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Capacity</dt><dd className="mt-0.5 font-medium">{event.capacity}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Sold</dt><dd className="mt-0.5 font-medium">{sold}</dd></div>
        </dl>
      </SectionCard>

      <SectionCard eyebrow="Tickets" title="Ticket types">
        <div className="space-y-4">
          {event.ticketTypes.map((t) => (
            <div key={t.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{t.name}</p>
                <p className="tabular text-sm text-muted-foreground">{peso(t.price)} · {peso(t.sold * t.price, { compact: true })} revenue</p>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
              <div className="mt-2"><CapacityBar sold={t.sold} capacity={t.quantity} label="Sold" size="sm" /></div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard eyebrow="Bookings" title={`Bookings (${bookings.length})`}>
        <DataTable rows={bookings} columns={bookingColumns} rowKey={(b) => b.id} empty={{ title: "No bookings yet" }} />
      </SectionCard>

      <SectionCard eyebrow="Attendees" title={`Attendees (${attendees.length})`}>
        <DataTable rows={attendees} columns={attendeeColumns} rowKey={(a) => a.id} empty={{ title: "No attendees yet" }} />
      </SectionCard>
    </div>
  );
}
