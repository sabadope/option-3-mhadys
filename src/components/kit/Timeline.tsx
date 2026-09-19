import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  key: string;
  label: string;
  at?: string | undefined;
  hint?: string | undefined;
}

/**
 * Vertical status stepper: ✓ done · ● current · ○ upcoming.
 * Reused for orders, work orders, and bookings.
 */
export function Timeline({ steps, currentIndex, className }: { steps: TimelineStep[]; currentIndex: number; className?: string }) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const last = i === steps.length - 1;
        return (
          <li key={s.key} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <motion.span
                initial={false}
                animate={{ scale: current ? 1.1 : 1 }}
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[10px]",
                  done && "border-module bg-module text-module-foreground",
                  current && "border-module bg-module-soft text-module ring-4 ring-module/15",
                  !done && !current && "border-border-strong bg-surface text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : <span className={cn("size-1.5 rounded-full", current ? "bg-module" : "bg-border-strong")} />}
              </motion.span>
              {!last && <span className={cn("w-px flex-1", done ? "bg-module/60" : "bg-border")} />}
            </div>
            <div className={cn("min-w-0 pb-6", last && "pb-0")}>
              <p className={cn("text-sm font-medium leading-6", !done && !current && "text-muted-foreground")}>{s.label}</p>
              {(s.at || s.hint) && <p className="text-xs text-muted-foreground">{s.hint ?? s.at}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Horizontal compact variant for cards. */
export function ProgressSteps({ steps, currentIndex, className }: { steps: string[]; currentIndex: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Step ${currentIndex + 1} of ${steps.length}`}>
      {steps.map((s, i) => (
        <span
          key={s}
          title={s}
          className={cn("h-1 flex-1 rounded-full transition-colors", i <= currentIndex ? "bg-module" : "bg-border-strong")}
        />
      ))}
    </div>
  );
}
