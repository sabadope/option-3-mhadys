import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatDate, formatTime, peso } from "@/lib/format";
import { Brand } from "@/components/shell/Brand";
import { EmptyState } from "@/components/kit";

export const Route = createFileRoute("/book/")({
  head: () => ({
    meta: [
      { title: "Book Tickets — Nimbus Events" },
      { name: "description", content: "Browse upcoming events and book your tickets in minutes." },
      { property: "og:title", content: "Book Tickets — Nimbus Events" },
      { property: "og:description", content: "Discover and book tickets for upcoming events." },
    ],
  }),
  component: BookIndex,
});

function BookIndex() {
  const { state } = useApp();
  const events = state.events
    .filter((e) => e.status === "published")
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to="/book"><Brand /></Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="mb-8">
          <p className="eyebrow">Upcoming events</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find your next event</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
            Browse events and book tickets — confirmation and digital tickets delivered instantly.
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState title="No events open for booking" description="Check back soon for new events." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((e) => {
              const cheapest = e.ticketTypes.length > 0 ? Math.min(...e.ticketTypes.map((t) => t.price)) : 0;
              return (
                <Link key={e.id} to="/book/$eventId" params={{ eventId: e.id }} className="press surface group block overflow-hidden rounded-2xl">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src={e.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                    <p className="absolute bottom-3 left-3 right-3 truncate text-sm font-semibold text-white">{e.name}</p>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" /> {formatDate(e.date, "EEE, MMM d")} · {formatTime(e.startTime)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" /> <span className="truncate">{e.venue}</span>
                    </div>
                    <p className="pt-1 text-sm font-semibold text-module">from {peso(cheapest)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
