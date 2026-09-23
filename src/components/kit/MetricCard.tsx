import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  className?: string;
  size?: "md" | "lg";
  /** Renders a small visualization on the right (sparkline, progress). */
  visual?: ReactNode;
}

export function MetricCard({ label, value, delta, hint, icon, className, size = "md", visual }: Props) {
  const up = delta !== undefined && delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn("surface flex min-w-0 flex-col justify-between rounded-2xl p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {icon && <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>}
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className={cn("tabular font-semibold tracking-tight", size === "lg" ? "text-3xl sm:text-4xl" : "text-[28px] leading-none")}>
            {value}
          </p>
          {(delta !== undefined || hint) && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              {delta !== undefined && (
                <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-success" : "text-destructive")}>
                  {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(delta).toFixed(1)}%
                </span>
              )}
              {hint && <span>{hint}</span>}
            </p>
          )}
        </div>
        {visual && <div className="shrink-0">{visual}</div>}
      </div>
    </motion.div>
  );
}

/** Compact inline stat used inside composed panels. */
export function Stat({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="tabular mt-0.5 truncate text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
