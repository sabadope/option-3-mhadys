import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function CapacityBar({
  sold,
  capacity,
  label,
  className,
  size = "md",
}: {
  sold: number;
  capacity: number;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0;
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{label ?? "Capacity"}</span>
        <span className="tabular font-medium">
          {sold.toLocaleString()} / {capacity.toLocaleString()}
        </span>
      </div>
      <div className={cn("overflow-hidden rounded-full bg-surface-2", size === "sm" ? "h-1.5" : "h-2")}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
          className={cn("h-full rounded-full", pct >= 95 ? "bg-destructive" : pct >= 75 ? "bg-warning" : "bg-module")}
        />
      </div>
    </div>
  );
}
