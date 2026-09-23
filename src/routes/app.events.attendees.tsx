import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/kit";
import { AttendeeTable } from "@/components/events/AttendeeTable";
import type { FilterDef } from "@/components/kit";

export const Route = createFileRoute("/app/events/attendees")({
  head: () => ({
    meta: [
      { title: "Attendees — Nimbus" },
      { name: "description", content: "Search and check in attendees across every event." },
      { property: "og:title", content: "Attendees — Nimbus" },
      { property: "og:description", content: "Every attendee, ready for check-in." },
    ],
  }),
  component: EventsAttendees,
});

function EventsAttendees() {
  const { state } = useApp();

  const rows = useMemo(
    () =>
      state.attendees.map((a) => {
        const event = state.events.find((e) => e.id === a.eventId);
        const booking = state.bookings.find((b) => b.id === a.bookingId);
        const ticketName = event?.ticketTypes.find((t) => t.id === a.ticketTypeId)?.name ?? "—";
        return { attendee: a, event, ticketName, bookingCode: booking?.code ?? "—" };
      }),
    [state.attendees, state.events, state.bookings],
  );

  const filters: FilterDef[] = [
    { key: "event", label: "Event", options: state.events.map((e) => ({ value: e.id, label: e.name })) },
    { key: "status", label: "Status", options: [
      { value: "in", label: "Checked in" },
      { value: "out", label: "Not yet" },
    ] },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="Attendees" description="Search attendees and check them in." />
      <AttendeeTable
        rows={rows}
        filters={filters}
        filterFn={(r, active) =>
          (!active.event || r.event?.id === active.event) &&
          (!active.status || (active.status === "in" ? r.attendee.checkedIn : !r.attendee.checkedIn))
        }
      />
    </div>
  );
}
