import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, ScanLine, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type ScanResult =
  | { kind: "success"; name: string; ticketType: string; eventName: string; at: Date }
  | { kind: "duplicate"; name: string; ticketType: string; eventName: string; at: Date }
  | { kind: "invalid"; code: string };

export function ScannerFrame({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-border-strong bg-black/60">
      <div className="module-atmosphere absolute inset-0 opacity-40" />
      {/* corner brackets */}
      {[
        "left-4 top-4 border-l-2 border-t-2",
        "right-4 top-4 border-r-2 border-t-2",
        "left-4 bottom-4 border-l-2 border-b-2",
        "right-4 bottom-4 border-r-2 border-b-2",
      ].map((pos) => (
        <span key={pos} className={cn("absolute size-9 rounded-sm border-module", pos)} aria-hidden />
      ))}
      {scanning && (
        <motion.div
          initial={{ y: "8%" }}
          animate={{ y: "92%" }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute left-4 right-4 h-0.5 rounded-full bg-module shadow-[0_0_16px_2px_var(--module)]"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <ScanLine className="size-10 opacity-30" />
      </div>
    </div>
  );
}

export function ScanResultPanel({ result }: { result: ScanResult | null }) {
  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key={result.kind + ("code" in result ? result.code : result.name + result.at.toISOString())}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className={cn(
            "rounded-2xl p-6 text-center",
            result.kind === "success" && "bg-success/12 text-success",
            result.kind === "duplicate" && "bg-warning/14 text-warning",
            result.kind === "invalid" && "bg-destructive/14 text-destructive",
          )}
        >
          {result.kind === "success" && (
            <>
              <CheckCircle2 className="mx-auto size-10" />
              <p className="mt-3 text-lg font-semibold tracking-tight">CHECK-IN SUCCESSFUL</p>
              <p className="mt-2 text-sm text-foreground">{result.name}</p>
              <p className="text-xs text-muted-foreground">
                {result.ticketType} · {result.eventName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{format(result.at, "h:mm a")}</p>
            </>
          )}
          {result.kind === "duplicate" && (
            <>
              <AlertCircle className="mx-auto size-10" />
              <p className="mt-3 text-lg font-semibold tracking-tight">ALREADY CHECKED IN</p>
              <p className="mt-2 text-sm text-foreground">{result.name}</p>
              <p className="text-xs text-muted-foreground">
                {result.ticketType} · {result.eventName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Checked in at {format(result.at, "h:mm a")}</p>
            </>
          )}
          {result.kind === "invalid" && (
            <>
              <XCircle className="mx-auto size-10" />
              <p className="mt-3 text-lg font-semibold tracking-tight">INVALID TICKET</p>
              <p className="mt-2 text-xs text-muted-foreground">Code "{result.code}" was not found for this event.</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
