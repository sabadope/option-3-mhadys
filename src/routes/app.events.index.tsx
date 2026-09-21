import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, CheckCircle2, Ticket, TrendingUp, Users } from "lucide-react";
import { useApp, eventSold, eventRevenue } from "@/lib/store";
import { ticketSalesSeries } from "@/data/events";
import { formatDate, formatTime, peso, TODAY } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { PageHeader, SectionCard, MetricCard, StatusBadge, TrendAreaChart, PersonCell, PageSkeleton } from "@/components/kit";
import { CapacityBar } from "@/components/events/CapacityBar";
import { addDays, isSameDay, parseISO } from "date-fns";

export const Route = createFileRoute("/app/events/")({
  head: () => ({
    meta: [
      { title: "Event Overview — Nimbus" },
      { name: "description", content: "Track upcoming events, ticket sales, bookings, and check-ins from one dashboard." },
      { property: "og:title", content: "Event Overview — Nimbus" },
      { property: "og:description", content: "Your event operations at a glance." },
    ],
  }),
  component: EventsDashboard,
});

function EventsDashboard() {
  const loading = useSimulatedLoading();
  const { state } = useApp();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Events" title="Overview" />
        <PageSkeleton />
      </div>
    );
  }

  const today = parseISO(TODAY);
  const upcoming = [...state.events]
    .filter((e) => e.status === "published" && e.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const todayEvent = state.events.find((e) => e.date === TODAY);
  const todaysBookings = state.bookings
    .filter((b) => b.createdAt.slice(0, 10) === TODAY)
    .slice(0, 6);

  const next7 = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const eventDays = new Set(state.events.map((e) => e.date));

  const attendeesToday = todayEvent ? state.attendees.filter((a) => a.eventId === todayEvent.id) : [];
  const checkedIn = attendeesToday.filter((a) => a.checkedIn).length;

  const totalRevenue = state.events.reduce((a, e) => a + eventRevenue(e), 0);
  const totalCapacity = state.events.reduce((a, e) => a + e.capacity, 0);
  const totalSold = state.events.reduce((a, e) => a + eventSold(e), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Events"
        title="Overview"
        description="Everything happening across your events today."
        atmosphere
        actions={
          <Link to="/app/events/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-module px-5 text-sm font-medium text-module-foreground hover:brightness-110">
            New event
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={peso(totalRevenue, { compact: true })} icon={<TrendingUp />} hint="all events" />
        <MetricCard label="Tickets sold" value={totalSold.toLocaleString()} icon={<Ticket />} hint={`of ${totalCapacity.toLocaleString()} capacity`} />
        <MetricCard label="Bookings today" value={String(todaysBookings.length)} icon={<CalendarDays />} hint={TODAY} />
        <MetricCard
          label="Checked-in today"
          value={todayEvent ? `${checkedIn}/${attendeesToday.length}` : "—"}
          icon={<CheckCircle2 />}
          hint={todayEvent?.name ?? "No event today"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Hero upcoming event */}
        <div className="xl:col-span-2">
          {upcoming ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="surface relative overflow-hidden rounded-2xl">
              <div className="relative h-48 w-full overflow-hidden sm:h-56">
                <img src={upcoming.coverImage} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute left-5 top-5">
                  <p className="eyebrow text-white/80">Upcoming event</p>
                </div>
              </div>
              <div className="-mt-10 space-y-4 px-5 pb-5 sm:px-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{upcoming.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(upcoming.date, "EEEE, MMM d")} · {formatTime(upcoming.startTime)} · {upcoming.venue}
                    </p>
                  </div>
                  <Link
                    to="/app/events/$eventId"
                    params={{ eventId: upcoming.id }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-module hover:underline"
                  >
                    View Event <ArrowRight className="size-4" />
                  </Link>
                </div>
                <CapacityBar sold={eventSold(upcoming)} capacity={upcoming.capacity} label={`${eventSold(upcoming)} / ${upcoming.capacity} attendees`} />
              </div>
            </motion.div>
          ) : (
            <SectionCard title="No upcoming events" eyebrow="Upcoming event">
              <p className="text-sm text-muted-foreground">Create an event to see it featured here.</p>
            </SectionCard>
          )}

          <SectionCard eyebrow="Sales" title="Ticket revenue, last 14 days" className="mt-4">
            <TrendAreaChart data={ticketSalesSeries} dataKey="revenue" xKey="day" format={(v) => peso(v, { compact: true })} id="events-revenue" />
          </SectionCard>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <SectionCard eyebrow="Calendar" title="Next 7 days">
            <div className="grid grid-cols-7 gap-1.5">
              {next7.map((d) => (
                <div key={d.toISOString()} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "narrow" })}</span>
                  <span
                    className={
                      "grid size-7 place-items-center rounded-full text-xs " +
                      (isSameDay(d, today) ? "bg-module text-module-foreground" : "text-foreground")
                    }
                  >
                    {d.getDate()}
                  </span>
                  <span className={"size-1 rounded-full " + (eventDays.has(d.toISOString().slice(0, 10)) ? "bg-module" : "bg-transparent")} />
                </div>
              ))}
            </div>
            <Link to="/app/events/calendar" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-module hover:underline">
              Open full calendar <ArrowRight className="size-3" />
            </Link>
          </SectionCard>

          <SectionCard eyebrow="Today" title="Bookings today" action={<Link to="/app/events/bookings" className="text-xs font-medium text-module hover:underline">View all</Link>}>
            {todaysBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings placed today yet.</p>
            ) : (
              <ul className="space-y-3">
                {todaysBookings.map((b) => {
                  const customer = state.customers.find((c) => c.id === b.customerId);
                  return (
                    <li key={b.id} className="flex items-center justify-between gap-3">
                      <PersonCell name={customer?.name ?? "Guest"} sub={b.code} size="sm" />
                      <div className="text-right">
                        <p className="tabular text-sm font-medium">{peso(b.amount)}</p>
                        <StatusBadge status={b.status} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard eyebrow="Attendance" title={todayEvent ? todayEvent.name : "No event today"}>
            {todayEvent ? (
              <div className="flex items-center gap-4">
                <Users className="size-8 text-module" />
                <div>
                  <p className="tabular text-2xl font-semibold">{checkedIn}/{attendeesToday.length}</p>
                  <p className="text-xs text-muted-foreground">checked in vs expected</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing scheduled for today.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
