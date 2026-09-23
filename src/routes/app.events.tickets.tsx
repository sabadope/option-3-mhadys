import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, SectionCard, EmptyState, PersonCell } from "@/components/kit";
import { TicketCard } from "@/components/events/TicketCard";
import { DigitalTicket } from "@/components/events/DigitalTicket";
import { Ticket } from "lucide-react";
import type { Attendee } from "@/types";

export const Route = createFileRoute("/app/events/tickets")({
  head: () => ({
    meta: [
      { title: "Tickets — Nimbus" },
      { name: "description", content: "Manage ticket types by event and preview attendee digital tickets." },
      { property: "og:title", content: "Tickets — Nimbus" },
      { property: "og:description", content: "Every ticket type, grouped by event." },
    ],
  }),
  component: EventsTickets,
});

function EventsTickets() {
  const { state } = useApp();
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  const eventsWithTickets = state.events.filter((e) => e.ticketTypes.length > 0);
  const previewEvent = selectedAttendee ? state.events.find((e) => e.id === selectedAttendee.eventId) : undefined;
  const previewTicket = previewEvent && selectedAttendee ? previewEvent.ticketTypes.find((t) => t.id === selectedAttendee.ticketTypeId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="Tickets" description="Ticket types grouped by event, with digital ticket previews." />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {eventsWithTickets.length === 0 ? (
            <EmptyState icon={<Ticket />} title="No ticket types yet" description="Ticket types will appear once events are created." />
          ) : (
            eventsWithTickets.map((event) => (
              <SectionCard key={event.id} eyebrow={event.category} title={event.name}>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {event.ticketTypes.map((t, i) => (
                    <TicketCard key={t.id} event={event} ticketType={t} index={i} />
                  ))}
                </div>
              </SectionCard>
            ))
          )}
        </div>

        <div className="space-y-4">
          <SectionCard eyebrow="Preview" title="Attendee ticket preview">
            <p className="mb-3 text-xs text-muted-foreground">Select an attendee to preview their digital ticket.</p>
            <div className="max-h-72 space-y-1.5 overflow-y-auto">
              {state.attendees.slice(0, 30).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAttendee(a)}
                  className={`w-full rounded-xl p-2 text-left transition-colors hover:bg-accent ${selectedAttendee?.id === a.id ? "bg-module-soft" : ""}`}
                >
                  <PersonCell name={a.name} sub={a.email} size="sm" />
                </button>
              ))}
            </div>
          </SectionCard>

          {previewEvent && previewTicket && selectedAttendee && (
            <DigitalTicket event={previewEvent} ticketType={previewTicket} holder={selectedAttendee.name} code={selectedAttendee.qrCode} />
          )}
        </div>
      </div>
    </div>
  );
}
