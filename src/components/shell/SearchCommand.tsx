import { useNavigate } from "@tanstack/react-router";
import { Car, ClipboardList, Package, Receipt, Sparkles, Ticket, Users, Wrench } from "lucide-react";
import { useEffect } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useApp } from "@/lib/store";
import { peso } from "@/lib/format";

export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const { state } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  const customerName = (id: string) => state.customers.find((c) => c.id === id)?.name ?? "";

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search customers, events, orders, vehicles…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Customers">
          {state.customers.map((c) => (
            <CommandItem key={c.id} value={`customer ${c.name} ${c.email}`} onSelect={() => go(`/app/customers/${c.id}`)}>
              <Users className="mr-2 size-4 text-muted-foreground" />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.email}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Events">
          {state.events.map((e) => (
            <CommandItem key={e.id} value={`event ${e.name} ${e.venue}`} onSelect={() => go(`/app/events/${e.id}`)}>
              <Sparkles className="mr-2 size-4 text-event" />
              <span>{e.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{e.date}</span>
            </CommandItem>
          ))}
          {state.bookings.slice(0, 6).map((b) => (
            <CommandItem key={b.id} value={`booking ${b.code} ${customerName(b.customerId)}`} onSelect={() => go("/app/events/bookings")}>
              <ClipboardList className="mr-2 size-4 text-event" />
              <span>{b.code}</span>
              <span className="ml-auto text-xs text-muted-foreground">{customerName(b.customerId)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Commerce">
          {state.products.map((p) => (
            <CommandItem key={p.id} value={`product ${p.name} ${p.sku}`} onSelect={() => go(`/app/commerce/products/${p.id}`)}>
              <Package className="mr-2 size-4 text-commerce" />
              <span>{p.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{peso(p.price)}</span>
            </CommandItem>
          ))}
          {state.orders.map((o) => (
            <CommandItem key={o.id} value={`order ${o.number} ${customerName(o.customerId)}`} onSelect={() => go(`/app/commerce/orders/${o.id}`)}>
              <Receipt className="mr-2 size-4 text-commerce" />
              <span>Order {o.number}</span>
              <span className="ml-auto text-xs text-muted-foreground">{customerName(o.customerId)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Auto Care">
          {state.vehicles.map((v) => (
            <CommandItem key={v.id} value={`vehicle ${v.make} ${v.model} ${v.plate}`} onSelect={() => go(`/app/autocare/vehicles/${v.id}`)}>
              <Car className="mr-2 size-4 text-autocare" />
              <span>
                {v.make} {v.model}
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{v.plate}</span>
            </CommandItem>
          ))}
          {state.workOrders.map((w) => (
            <CommandItem key={w.id} value={`work order ${w.code}`} onSelect={() => go(`/app/autocare/work-orders/${w.id}`)}>
              <Wrench className="mr-2 size-4 text-autocare" />
              <span>{w.code}</span>
              <span className="ml-auto text-xs capitalize text-muted-foreground">{w.status.replace("_", " ")}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go("/app/events/checkin")}>
            <Ticket className="mr-2 size-4" /> QR Check-in
          </CommandItem>
          <CommandItem onSelect={() => go("/app/autocare/appointments/new")}>
            <Car className="mr-2 size-4" /> New appointment
          </CommandItem>
          <CommandItem onSelect={() => go("/app/commerce/products/new")}>
            <Package className="mr-2 size-4" /> New product
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
