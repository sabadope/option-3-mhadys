import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/kit";
import { ResourceScheduler } from "@/components/autocare/ResourceScheduler";
import { useApp } from "@/lib/store";
import { formatDateLong, TODAY } from "@/lib/format";

export const Route = createFileRoute("/app/autocare/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Auto Care" },
      { name: "description", content: "Bay and staff resource schedule for auto care appointments." },
      { property: "og:title", content: "Calendar — Auto Care" },
      { property: "og:description", content: "Drag-and-drop resource scheduler for bays and staff." },
    ],
  }),
  component: Page,
});

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function Page() {
  const { state } = useApp();
  const [date, setDate] = useState(TODAY);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="Calendar"
        description="Drag appointments across bays or staff lanes to reschedule."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon" aria-label="Previous day" onClick={() => setDate((d) => shiftDate(d, -1))}>
              <ChevronLeft />
            </Button>
            <Button variant="secondary" onClick={() => setDate(TODAY)}>
              <CalendarDays /> Today
            </Button>
            <Button variant="secondary" size="icon" aria-label="Next day" onClick={() => setDate((d) => shiftDate(d, 1))}>
              <ChevronRight />
            </Button>
          </div>
        }
      />
      <p className="text-sm text-muted-foreground">{formatDateLong(date)}</p>
      <ResourceScheduler date={date} appointments={state.appointments} />
    </div>
  );
}
