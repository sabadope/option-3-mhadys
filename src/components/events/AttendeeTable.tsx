import { useState } from "react";
import { CheckCircle2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, PersonCell, StatusBadge, type Column, type FilterDef } from "@/components/kit";
import { useApp } from "@/lib/store";
import { format } from "date-fns";
import type { Attendee, Event } from "@/types";

interface Row {
  attendee: Attendee;
  event?: Event;
  ticketName: string;
  bookingCode: string;
}

export function AttendeeTable({
  rows,
  filters,
  filterFn,
  showEventColumn = true,
}: {
  rows: Row[];
  filters?: FilterDef[];
  filterFn?: (row: Row, active: Record<string, string>) => boolean;
  showEventColumn?: boolean;
}) {
  const { actions } = useApp();
  const [justChecked, setJustChecked] = useState<Record<string, boolean>>({});

  const checkIn = (row: Row) => {
    actions.checkInAttendee(row.attendee.id);
    setJustChecked((s) => ({ ...s, [row.attendee.id]: true }));
    toast.success(`${row.attendee.name} checked in`);
  };

  const undo = (row: Row) => {
    actions.undoCheckIn(row.attendee.id);
    setJustChecked((s) => ({ ...s, [row.attendee.id]: false }));
    toast("Check-in undone");
  };

  const columns: Column<Row>[] = [
    { key: "name", header: "Attendee", cell: (r) => <PersonCell name={r.attendee.name} sub={r.attendee.email} /> },
    { key: "ticket", header: "Ticket Type", cell: (r) => r.ticketName },
    { key: "code", header: "Booking", cell: (r) => <span className="tabular">{r.bookingCode}</span>, hideBelow: "lg" },
    ...(showEventColumn ? [{ key: "event", header: "Event", cell: (r: Row) => r.event?.name ?? "—", hideBelow: "lg" } satisfies Column<Row>] : []),
    {
      key: "status",
      header: "Status",
      cell: (r) => (r.attendee.checkedIn ? <StatusBadge status="checked_in" label="Checked in" /> : <StatusBadge status="pending" label="Not yet" />),
    },
    {
      key: "action",
      header: "",
      align: "right",
      cell: (r) =>
        r.attendee.checkedIn ? (
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">
              Checked in ✓ {r.attendee.checkedInAt ? format(new Date(r.attendee.checkedInAt), "h:mm a") : ""}
            </span>
            <Button size="icon-sm" variant="ghost" aria-label="Undo check-in" onClick={() => undo(r)}>
              <Undo2 />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="module" onClick={() => checkIn(r)}>
            <CheckCircle2 /> Check In
          </Button>
        ),
    },
  ];

  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey={(r) => r.attendee.id}
      searchable={(r) => `${r.attendee.name} ${r.attendee.email} ${r.bookingCode} ${r.event?.name ?? ""}`}
      searchPlaceholder="Search attendees…"
      filters={filters}
      filterFn={filterFn}
      renderCard={(r) => (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <PersonCell name={r.attendee.name} sub={r.ticketName} />
            {r.attendee.checkedIn ? <StatusBadge status="checked_in" label="Checked in" /> : <StatusBadge status="pending" label="Not yet" />}
          </div>
          {showEventColumn && r.event && <p className="text-xs text-muted-foreground">{r.event.name}</p>}
          <p className="tabular text-xs text-muted-foreground">{r.bookingCode}</p>
          {r.attendee.checkedIn ? (
            <Button size="sm" variant="ghost" className="w-full" onClick={() => undo(r)}>
              <Undo2 /> Undo check-in
            </Button>
          ) : (
            <Button size="sm" variant="module" className="w-full" onClick={() => checkIn(r)}>
              <CheckCircle2 /> Check In
            </Button>
          )}
        </div>
      )}
      empty={{ title: "No attendees found", description: "Attendees will show up here once bookings are made." }}
    />
  );
}
