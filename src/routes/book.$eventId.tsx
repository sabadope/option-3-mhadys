import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Check, Minus, MapPin, Plus, Wallet } from "lucide-react";
import { useApp } from "@/lib/store";
import { formatDate, formatTime, peso } from "@/lib/format";
import { Brand } from "@/components/shell/Brand";
import { EmptyState, PaymentPanel } from "@/components/kit";
import { DigitalTicket } from "@/components/events/DigitalTicket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Attendee, PaymentMethod, TicketType } from "@/types";

export const Route = createFileRoute("/book/$eventId")({
  head: () => ({
    meta: [
      { title: "Book Event — Nimbus" },
      { name: "description", content: "Select your tickets, check out, and receive instant digital tickets." },
      { property: "og:title", content: "Book Event — Nimbus" },
      { property: "og:description", content: "Fast, secure ticket booking." },
    ],
  }),
  component: BookEvent,
});

type Step = "select" | "checkout" | "ticket";

function BookEvent() {
  const { eventId } = Route.useParams();
  const { state, actions } = useApp();
  const event = state.events.find((e) => e.id === eventId);

  const [step, setStep] = useState<Step>("select");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [names, setNames] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<{ attendee: Attendee; ticketType: TicketType }[]>([]);

  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const total = useMemo(
    () => (event ? event.ticketTypes.reduce((sum, t) => sum + (qty[t.id] ?? 0) * t.price, 0) : 0),
    [event, qty],
  );

  if (!event) {
    return (
      <div className="min-h-screen bg-background px-5 py-10">
        <EmptyState title="Event not found" description="This event may not be available for booking." />
      </div>
    );
  }

  const setQtyFor = (id: string, delta: number, max: number) =>
    setQty((q) => {
      const next = Math.max(0, Math.min(max, (q[id] ?? 0) + delta));
      return { ...q, [id]: next };
    });

  const goToCheckout = () => {
    if (totalQty === 0) {
      toast.error("Select at least one ticket.");
      return;
    }
    setNames(Array.from({ length: totalQty }, (_, i) => names[i] ?? ""));
    setStep("checkout");
  };

  const pay = (method: PaymentMethod) => {
    if (names.some((n) => !n.trim()) || !email.trim()) {
      toast.error("Fill in all attendee names and an email.");
      setStep("select");
      return;
    }
    let cursor = 0;
    const allTickets: { attendee: Attendee; ticketType: TicketType }[] = [];
    event.ticketTypes.forEach((t) => {
      const n = qty[t.id] ?? 0;
      if (n === 0) return;
      const group = names.slice(cursor, cursor + n);
      cursor += n;
      const { attendees } = actions.addBooking(
        { customerId: "c_3", eventId: event.id, ticketTypeId: t.id, quantity: n, amount: n * t.price, status: "confirmed", paymentMethod: method },
        group,
        email,
      );
      attendees.forEach((a) => allTickets.push({ attendee: a, ticketType: t }));
    });
    setTickets(allTickets);
    setStep("ticket");
  };

  const steps: { id: Step; label: string }[] = [
    { id: "select", label: "Select tickets" },
    { id: "checkout", label: "Checkout" },
    { id: "ticket", label: "Your ticket" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to="/book"><Brand /></Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <div className="surface mb-6 overflow-hidden rounded-2xl">
          <div className="relative h-44 w-full sm:h-56">
            <img src={event.coverImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="-mt-8 space-y-2 px-5 pb-5 sm:px-6">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{event.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4" /> {formatDate(event.date, "EEEE, MMM d, yyyy")} · {formatTime(event.startTime)}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {event.venue}</span>
            </div>
          </div>
        </div>

        <ol className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => {
            const idx = steps.findIndex((x) => x.id === step);
            const done = i < idx;
            const active = s.id === step;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <span className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                  active ? "bg-module text-module-foreground" : done ? "bg-module-soft text-module" : "bg-surface-2 text-muted-foreground",
                )}>
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className={cn("hidden text-xs font-medium sm:inline", active ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        {step === "select" && (
          <div className="space-y-5">
            <div className="space-y-3">
              {event.ticketTypes.map((t) => {
                const remaining = t.quantity - t.sold;
                const n = qty[t.id] ?? 0;
                return (
                  <div key={t.id} className="surface flex items-center justify-between gap-3 rounded-2xl p-4">
                    <div className="min-w-0">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                      <p className="tabular mt-1 text-sm font-semibold">{peso(t.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="icon" disabled={n === 0} onClick={() => setQtyFor(t.id, -1, remaining)} aria-label={`Fewer ${t.name}`}>
                        <Minus className="size-4" />
                      </Button>
                      <span className="tabular w-6 text-center text-sm font-semibold">{n}</span>
                      <Button variant="secondary" size="icon" disabled={n >= remaining} onClick={() => setQtyFor(t.id, 1, remaining)} aria-label={`More ${t.name}`}>
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalQty > 0 && (
              <div className="surface space-y-3 rounded-2xl p-4">
                <p className="eyebrow">Attendee details</p>
                {Array.from({ length: totalQty }).map((_, i) => (
                  <Input
                    key={i}
                    value={names[i] ?? ""}
                    onChange={(e) => setNames((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
                    placeholder={`Attendee ${i + 1} full name`}
                    className="h-11 rounded-xl border-border-strong bg-surface-2"
                  />
                ))}
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for tickets"
                  className="h-11 rounded-xl border-border-strong bg-surface-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-2xl bg-surface-2 p-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="tabular text-lg font-semibold">{peso(total)}</span>
            </div>

            <Button variant="module" size="lg" className="w-full" onClick={goToCheckout}>
              Continue to checkout
            </Button>
          </div>
        )}

        {step === "checkout" && (
          <div className="space-y-5">
            <div className="surface space-y-3 rounded-2xl p-5">
              <p className="eyebrow">Order summary</p>
              {event.ticketTypes.filter((t) => (qty[t.id] ?? 0) > 0).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.name} × {qty[t.id]}</span>
                  <span className="tabular">{peso((qty[t.id] ?? 0) * t.price)}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Tickets will be emailed to {email || "your email"}.</p>
            </div>

            <PaymentPanel summary={{ subtotal: total, total, status: "unpaid" }} onPay={pay} ctaLabel={`Pay ${peso(total)}`} />

            <Button variant="ghost" className="w-full" onClick={() => setStep("select")}>Back to ticket selection</Button>
          </div>
        )}

        {step === "ticket" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-success/12 px-4 py-3 text-center text-sm font-medium text-success">
              Booking confirmed! Your tickets are ready below.
            </div>
            <div className="space-y-4">
              {tickets.map(({ attendee, ticketType }) => (
                <DigitalTicket key={attendee.id} event={event} ticketType={ticketType} holder={attendee.name} code={attendee.qrCode} />
              ))}
            </div>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => toast.success("Added to wallet.")}>
              <Wallet className="size-4" /> Add to wallet
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/book">Book another event</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
