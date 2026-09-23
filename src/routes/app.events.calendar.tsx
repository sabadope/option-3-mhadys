import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { addDays, addMonths, format, subMonths } from "date-fns";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useApp, eventSold } from "@/lib/store";
import { TODAY, formatDate, formatTime } from "@/lib/format";
import { PageHeader, StatusBadge, Chip } from "@/components/kit";
import { CapacityBar } from "@/components/events/CapacityBar";
import { MonthView, WeekView, DayView } from "@/components/events/EventCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Event } from "@/types";

export const Route = createFileRoute("/app/events/calendar")({
  head: () => ({
    meta: [
      { title: "Event Calendar — Nimbus" },
      { name: "description", content: "See every event scheduled across months, weeks, and days." },
      { property: "og:title", content: "Event Calendar — Nimbus" },
      { property: "og:description", content: "Plan ahead with a full event calendar." },
    ],
  }),
  component: EventsCalendar,
});

type ViewMode = "month" | "week" | "day";

function EventsCalendar() {
  const { state } = useApp();
  const today = useMemo(() => new Date(`${TODAY}T00:00:00`), []);
  const [cursor, setCursor] = useState(today);
  const [mode, setMode] = useState<ViewMode>("month");
  const [selected, setSelected] = useState<Event | null>(null);

  const step = (dir: 1 | -1) => {
    if (mode === "month") setCursor((c) => (dir === 1 ? addMonths(c, 1) : subMonths(c, 1)));
    else if (mode === "week") setCursor((c) => addDays(c, dir * 7));
    else setCursor((c) => addDays(c, dir));
  };

  const title =
    mode === "month" ? format(cursor, "MMMM yyyy") : mode === "week" ? `Week of ${format(cursor, "MMM d, yyyy")}` : format(cursor, "EEEE, MMM d, yyyy");

  const sold = selected ? eventSold(selected) : 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="Calendar" description="Every event, mapped across time." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" aria-label="Previous" onClick={() => step(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCursor(today)}>
            Today
          </Button>
          <Button variant="secondary" size="icon" aria-label="Next" onClick={() => step(1)}>
            <ChevronRight />
          </Button>
          <p className="ml-2 text-sm font-semibold tracking-tight sm:text-base">{title}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-2 p-1">
          {(["month", "week", "day"] as ViewMode[]).map((m) => (
            <Chip key={m} selected={mode === m} onClick={() => setMode(m)}>
              {m[0]!.toUpperCase() + m.slice(1)}
            </Chip>
          ))}
        </div>
      </div>

      {mode === "month" && <MonthView cursor={cursor} today={today} events={state.events} onSelectEvent={setSelected} />}
      {mode === "week" && <WeekView cursor={cursor} today={today} events={state.events} onSelectEvent={setSelected} />}
      {mode === "day" && <DayView cursor={cursor} events={state.events} onSelectEvent={setSelected} />}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="glass-strong max-w-md rounded-3xl border">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="tracking-tight">{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <StatusBadge status={selected.status} />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" /> {formatDate(selected.date, "EEEE, MMM d, yyyy")} · {formatTime(selected.startTime)}–{formatTime(selected.endTime)}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> {selected.venue}
                </div>
                <CapacityBar sold={sold} capacity={selected.capacity} label={`${sold} / ${selected.capacity} attendees`} />
                <p className="text-sm text-muted-foreground">{selected.description}</p>
                <Button asChild variant="module" className="w-full">
                  <Link to="/app/events/$eventId" params={{ eventId: selected.id }}>
                    View event <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
