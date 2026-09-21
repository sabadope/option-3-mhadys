import { motion } from "motion/react";
import { Gauge, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { VehicleBadge } from "./VehicleBadge";
import type { Vehicle } from "@/types";

export function VehicleCard({
  vehicle,
  ownerName,
  lastServiceDate,
  visits,
  onClick,
  selected,
  className,
}: {
  vehicle: Vehicle;
  ownerName?: string;
  lastServiceDate?: string;
  visits?: number;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "press surface flex w-full flex-col gap-3 rounded-2xl p-4 text-left transition-colors",
        onClick && "cursor-pointer hover:bg-accent/40",
        selected && "ring-2 ring-module",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <VehicleBadge vehicle={vehicle} />
        <span className="eyebrow shrink-0">{vehicle.year}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {ownerName && (
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5" /> {ownerName}
          </span>
        )}
        {lastServiceDate && (
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-3.5" /> Last service {formatDate(lastServiceDate)}
          </span>
        )}
        {visits !== undefined && <span>{visits} visit{visits === 1 ? "" : "s"}</span>}
      </div>
      {vehicle.notes && <p className="truncate text-xs text-muted-foreground/80">{vehicle.notes}</p>}
    </motion.button>
  );
}
