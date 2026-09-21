import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { PageHeader, Chip, EmptyState, PageSkeleton } from "@/components/kit";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { EventStatus } from "@/types";

export const Route = createFileRoute("/app/events/list")({
  head: () => ({
    meta: [
      { title: "Events — Nimbus" },
      { name: "description", content: "Browse, filter, and manage all your events." },
      { property: "og:title", content: "Events — Nimbus" },
      { property: "og:description", content: "Every event you're running, in one grid." },
    ],
  }),
  component: EventsList,
});

const statuses: { value: EventStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function EventsList() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [q, setQ] = useState("");

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Events" title="All events" />
        <PageSkeleton />
      </div>
    );
  }

  const filtered = state.events.filter((e) => {
    if (status !== "all" && e.status !== status) return false;
    if (q && !`${e.name} ${e.venue} ${e.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Events"
        title="All events"
        description="Browse every event across your workspace."
        actions={
          <Link to="/app/events/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-module px-5 text-sm font-medium text-module-foreground hover:brightness-110">
            <Plus className="size-4" /> New event
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="h-10 rounded-full border-border-strong bg-surface-2 pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <Chip key={s.value} selected={status === s.value} onClick={() => setStatus(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Sparkles />}
          title="Your events will appear here."
          description="Create your first event to start selling tickets."
          action={
            <Link to="/app/events/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-module px-5 text-sm font-medium text-module-foreground hover:brightness-110">
              <Plus className="size-4" /> New event
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
