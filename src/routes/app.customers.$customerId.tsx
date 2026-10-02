import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Car, Mail, MapPin, Phone, ShoppingBag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, InitialsAvatar, SectionCard, Stat, StatusBadge } from "@/components/kit";
import { useApp } from "@/lib/store";
import { formatDate, formatDateTime, formatTime, humanize, peso } from "@/lib/format";
import { activity } from "@/data/shared";

export const Route = createFileRoute("/app/customers/$customerId")({
  head: () => ({
    meta: [
      { title: "Customer profile — Nimbus" },
      { name: "description", content: "Bookings, orders, vehicles, payments, and activity for a single customer." },
      { property: "og:title", content: "Customer profile — Nimbus" },
      { property: "og:description", content: "A complete customer record across modules." },
    ],
  }),
  component: Page,
});

function Page() {
  const { customerId } = Route.useParams();
  const { state } = useApp();
  const c = state.customers.find((x) => x.id === customerId);
  if (!c) return <EmptyState title="Customer not found" description="This profile may have been removed." action={<Button asChild variant="secondary"><Link to="/app/customers">Back to customers</Link></Button>} />;

  const bookings = state.bookings.filter((b) => b.customerId === c.id);
  const orders = state.orders.filter((o) => o.customerId === c.id);
  const vehicles = state.vehicles.filter((v) => v.customerId === c.id);
  const appts = state.appointments.filter((a) => a.customerId === c.id);
  const payments = state.payments.filter((p) => p.customerId === c.id);
  const acts = activity.filter((a) => a.customerId === c.id);
  const lifetime = bookings.filter((b) => b.status !== "cancelled").reduce((a, b) => a + b.amount, 0) + orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0) + appts.filter((a) => a.status === "completed").reduce((a, x) => a + x.total, 0);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/customers">
          <ArrowLeft /> Customers
        </Link>
      </Button>

      <header className="surface grid gap-6 rounded-2xl p-6 lg:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <InitialsAvatar name={c.name} size="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{c.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{c.phone}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{c.city}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.tags.map((t) => <StatusBadge key={t} status={t} label={t} tone="neutral" dot={false} />)}
              <span className="text-xs text-muted-foreground self-center">Customer since {formatDate(c.joinedAt, "MMMM yyyy")}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:text-right">
          <Stat label="Lifetime value" value={peso(lifetime)} />
          <Stat label="Bookings" value={bookings.length} />
          <Stat label="Orders" value={orders.length} />
          <Stat label="Vehicles" value={vehicles.length} />
        </div>
      </header>

      <Tabs defaultValue={vehicles.length ? "vehicles" : orders.length ? "orders" : "bookings"}>
        <TabsList className="flex h-11 w-full justify-start overflow-x-auto scrollbar-none rounded-full bg-surface-2 p-1 sm:w-fit">
          <TabsTrigger value="bookings" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"><Ticket className="mr-1.5 size-3.5" />Bookings</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"><ShoppingBag className="mr-1.5 size-3.5" />Orders</TabsTrigger>
          <TabsTrigger value="vehicles" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"><Car className="mr-1.5 size-3.5" />Vehicles</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Payments</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4" data-module="event">
          {bookings.length === 0 ? <EmptyState icon={<Ticket />} title="No bookings" description="Event bookings will appear here." /> : (
            <SectionCard bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {bookings.map((b) => {
                  const ev = state.events.find((e) => e.id === b.eventId);
                  const tt = ev?.ticketTypes.find((t) => t.id === b.ticketTypeId);
                  return (
                    <li key={b.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{ev?.name}</p>
                        <p className="text-xs text-muted-foreground">{b.code} · {b.quantity} × {tt?.name} · {ev && formatDate(ev.date, "MMM d")}</p>
                      </div>
                      <span className="tabular text-sm font-medium">{peso(b.amount)}</span>
                      <StatusBadge status={b.status} />
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-4" data-module="commerce">
          {orders.length === 0 ? <EmptyState icon={<ShoppingBag />} title="No orders" description="Merchandise orders will appear here." /> : (
            <SectionCard bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {orders.map((o) => (
                  <li key={o.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 3).map((it) => <img key={it.id} src={it.image} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-lg object-cover ring-2 ring-surface" />)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to="/app/commerce/orders/$orderId" params={{ orderId: o.id }} className="truncate text-sm font-medium hover:underline">Order {o.number}</Link>
                      <p className="text-xs text-muted-foreground">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {formatDateTime(o.createdAt)}</p>
                    </div>
                    <span className="tabular text-sm font-medium">{peso(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </TabsContent>

        <TabsContent value="vehicles" className="mt-4" data-module="autocare">
          {vehicles.length === 0 ? <EmptyState icon={<Car />} title="No vehicles" description="Add a vehicle to start a service record." /> : (
            <div className="grid gap-3 sm:grid-cols-2">
              {vehicles.map((v) => {
                const history = appts.filter((a) => a.vehicleId === v.id);
                return (
                  <Link key={v.id} to="/app/autocare/vehicles/$vehicleId" params={{ vehicleId: v.id }} className="surface press rounded-2xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="eyebrow">{v.year} · {v.color}</p>
                        <p className="mt-1 text-lg font-semibold tracking-tight">{v.make} {v.model}</p>
                      </div>
                      <span className="rounded-md border border-border-strong bg-surface-2 px-2 py-1 font-mono text-xs">{v.plate}</span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{history.length} visit{history.length !== 1 ? "s" : ""} on record</p>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          {payments.length === 0 ? <EmptyState title="No payments" description="Payments across modules appear here." /> : (
            <SectionCard bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {payments.map((p) => (
                  <li key={p.id} data-module={p.module} className="flex items-center gap-4 px-5 py-4">
                    <span className="size-2 rounded-full bg-module" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{p.referenceCode}</p>
                      <p className="text-xs text-muted-foreground">{humanize(p.method)} · {formatDateTime(p.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="tabular text-sm font-medium">{peso(p.total)}</p>
                      {p.balance > 0 && <p className="text-xs text-warning">Balance {peso(p.balance)}</p>}
                    </div>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          {acts.length === 0 && appts.length === 0 ? <EmptyState title="No activity yet" /> : (
            <SectionCard bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {acts.map((a) => (
                  <li key={a.id} data-module={a.module} className="flex items-center gap-4 px-5 py-4">
                    <span className="size-2 rounded-full bg-module" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDateTime(a.at)}</span>
                  </li>
                ))}
                {appts.map((a) => {
                  const s = state.services.find((x) => x.id === a.serviceId);
                  return (
                    <li key={a.id} data-module="autocare" className="flex items-center gap-4 px-5 py-4">
                      <span className="size-2 rounded-full bg-module" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{s?.name}</p>
                        <p className="text-xs text-muted-foreground">{a.code} · {formatDate(a.date, "MMM d")} {formatTime(a.time)}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
