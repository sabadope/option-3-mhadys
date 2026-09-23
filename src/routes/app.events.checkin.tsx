import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { QrCode, ScanLine, Search, Users } from "lucide-react";
import { useApp } from "@/lib/store";
import { NOW } from "@/lib/format";
import { PageHeader, SectionCard, MetricCard, PersonCell, StatusBadge } from "@/components/kit";
import { ScannerFrame, ScanResultPanel, type ScanResult } from "@/components/events/QRCodeCheckIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Attendee } from "@/types";

export const Route = createFileRoute("/app/events/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in — Nimbus" },
      { name: "description", content: "Scan or search attendees to check them in at the door." },
      { property: "og:title", content: "Check-in — Nimbus" },
      { property: "og:description", content: "Fast, reliable event check-in." },
    ],
  }),
  component: EventsCheckin,
});

function EventsCheckin() {
  const { state, actions } = useApp();
  const publishedEvents = state.events.filter((e) => e.status === "published" || e.date === state.events[0]?.date);
  const [eventId, setEventId] = useState(state.events[0]?.id ?? "");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<Attendee[]>([]);

  const event = state.events.find((e) => e.id === eventId);
  const attendees = useMemo(() => state.attendees.filter((a) => a.eventId === eventId), [state.attendees, eventId]);
  const checkedIn = attendees.filter((a) => a.checkedIn).length;

  const ticketName = (a: Attendee) => event?.ticketTypes.find((t) => t.id === a.ticketTypeId)?.name ?? "—";

  const resolveScan = (attendee: Attendee | undefined, code: string) => {
    if (!attendee || !event) {
      setResult({ kind: "invalid", code });
      toast.error("Ticket not recognized.");
      return;
    }
    if (attendee.checkedIn) {
      setResult({ kind: "duplicate", name: attendee.name, ticketType: ticketName(attendee), eventName: event.name, at: attendee.checkedInAt ? new Date(attendee.checkedInAt) : NOW });
      toast(`${attendee.name} already checked in`);
      return;
    }
    actions.checkInAttendee(attendee.id);
    setResult({ kind: "success", name: attendee.name, ticketType: ticketName(attendee), eventName: event.name, at: NOW });
    setRecent((r) => [{ ...attendee, checkedIn: true, checkedInAt: NOW.toISOString() }, ...r].slice(0, 8));
    toast.success(`${attendee.name} checked in`);
  };

  const simulate = (kind: "valid" | "used" | "invalid") => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (kind === "invalid") {
        resolveScan(undefined, `NMB-INVALID-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
        return;
      }
      const pool = kind === "used" ? attendees.filter((a) => a.checkedIn) : attendees.filter((a) => !a.checkedIn);
      const pick = pool[Math.floor(Math.random() * pool.length)] ?? attendees[0];
      resolveScan(pick, pick?.qrCode ?? "—");
    }, 900);
  };

  const manualSearch = () => {
    if (!query.trim()) return;
    const needle = query.trim().toLowerCase();
    const found = attendees.find(
      (a) => a.name.toLowerCase().includes(needle) || a.qrCode.toLowerCase() === needle || a.qrCode.toLowerCase().includes(needle),
    );
    resolveScan(found, query.trim());
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="Check-in" description="Scan tickets or search attendees at the door." />

      <div className="flex flex-wrap items-center gap-2">
        <p className="eyebrow">Event</p>
        <div className="flex flex-wrap gap-1.5">
          {publishedEvents.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => { setEventId(e.id); setResult(null); }}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium transition-colors",
                eventId === e.id ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground",
              )}
            >
              {e.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Checked in" value={String(checkedIn)} icon={<Users />} hint={event?.name} />
        <MetricCard label="Expected" value={String(attendees.length)} icon={<QrCode />} hint="total attendees" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Scanner" title="Simulate a scan">
          <ScannerFrame scanning={scanning} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button variant="module" onClick={() => simulate("valid")} disabled={scanning}>
              <ScanLine className="size-4" /> Valid
            </Button>
            <Button variant="secondary" onClick={() => simulate("used")} disabled={scanning}>
              Already used
            </Button>
            <Button variant="destructive" onClick={() => simulate("invalid")} disabled={scanning}>
              Invalid
            </Button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && manualSearch()}
                placeholder="Search by name or ticket code…"
                className="h-10 rounded-full border-border-strong bg-surface-2 pl-9"
              />
            </div>
            <Button variant="secondary" onClick={manualSearch}>Check</Button>
          </div>

          <div className="mt-4">
            <ScanResultPanel result={result} />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Recent" title="Recent check-ins">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No check-ins yet this session.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((a) => (
                <li key={a.id + (a.checkedInAt ?? "")} className="flex items-center justify-between gap-3">
                  <PersonCell name={a.name} sub={ticketName(a)} size="sm" />
                  <StatusBadge status="checked_in" label="Checked in" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
