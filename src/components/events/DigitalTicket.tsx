import { QrCode } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatDate, formatTime, peso } from "@/lib/format";
import type { Event, TicketType } from "@/types";

/** Deterministic QR-like pixel pattern derived from a code string (visual only). */
function QrPattern({ seed, size = 88 }: { seed: string; size?: number }) {
  const cells = 9;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bits: boolean[] = Array.from({ length: cells * cells }, (_, i) => {
    h = (h * 1103515245 + 12345 + i) >>> 0;
    return h % 3 === 0;
  });
  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-md bg-white p-1" role="img" aria-label={`QR code ${seed}`}>
      {bits.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cell;
        const y = Math.floor(i / cells) * cell;
        return <rect key={i} x={x} y={y} width={cell} height={cell} fill="#111114" />;
      })}
    </svg>
  );
}

export function DigitalTicket({
  event,
  ticketType,
  holder,
  code,
  gate,
  className,
}: {
  event: Event;
  ticketType: TicketType;
  holder: string;
  code: string;
  gate?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={cn("glass-strong glass-highlight relative overflow-hidden rounded-3xl", className)}
    >
      <div className="relative h-24 w-full overflow-hidden">
        <img src={event.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      </div>
      <div className="px-5 pb-2 pt-3">
        <p className="eyebrow">{ticketType.name}</p>
        <h3 className="mt-0.5 truncate text-[15px] font-semibold tracking-tight">{event.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(event.date, "MMM d, yyyy")} · {formatTime(event.startTime)} · {event.venue}
        </p>
      </div>

      <div className="relative my-3 flex items-center px-0">
        <div className="absolute -left-3 size-6 rounded-full bg-background" />
        <div className="mx-4 h-px w-full border-t border-dashed border-border-strong" />
        <div className="absolute -right-3 size-6 rounded-full bg-background" />
      </div>

      <div className="flex items-center gap-4 px-5 pb-5">
        <div className="min-w-0 flex-1 space-y-2 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Holder</p>
            <p className="truncate font-medium">{holder}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Price</p>
              <p className="tabular font-medium">{peso(ticketType.price)}</p>
            </div>
            {gate && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Gate</p>
                <p className="font-medium">{gate}</p>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-center">
          <QrPattern seed={code} />
          <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <QrCode className="size-3" /> {code}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
