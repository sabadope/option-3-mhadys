import { Car, CarFront, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { paintColor } from "./lib";
import type { Vehicle } from "@/types";

const typeIcon: Record<Vehicle["type"], typeof Car> = {
  sedan: Car,
  coupe: Car,
  hatchback: Car,
  suv: CarFront,
  van: CarFront,
  pickup: Truck,
};

/** Compact inline vehicle identity: icon, make/model, plate chip, color swatch. */
export function VehicleBadge({ vehicle, size = "md", className }: { vehicle: Vehicle; size?: "sm" | "md"; className?: string }) {
  const Icon = typeIcon[vehicle.type];
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-xl bg-module-soft text-module",
          size === "sm" ? "size-8 [&_svg]:size-4" : "size-10 [&_svg]:size-5",
        )}
        aria-hidden
      >
        <Icon />
      </span>
      <div className="min-w-0">
        <p className={cn("truncate font-medium leading-tight", size === "sm" ? "text-sm" : "text-[15px]")}>
          {vehicle.make} {vehicle.model}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex h-5 items-center rounded-md border border-border-strong bg-surface-2 px-1.5 font-mono text-[10px] font-semibold tracking-wider text-foreground/80">
            {vehicle.plate}
          </span>
          <span
            className="size-2.5 shrink-0 rounded-full ring-1 ring-border-strong"
            style={{ backgroundColor: paintColor(vehicle.color) }}
            title={vehicle.color}
            aria-label={`Color: ${vehicle.color}`}
          />
        </div>
      </div>
    </div>
  );
}
