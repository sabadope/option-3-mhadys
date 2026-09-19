import { useState } from "react";
import { Banknote, CreditCard, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { peso } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/types";

export interface PaymentSummary {
  subtotal: number;
  discount?: number;
  tax?: number;
  deposit?: number;
  total: number;
  balance?: number;
  status?: PaymentStatus;
}

const methods: { id: PaymentMethod; label: string; hint: string; icon: typeof Banknote }[] = [
  { id: "cash", label: "Cash", hint: "Collected in person", icon: Banknote },
  { id: "card", label: "Card", hint: "Visa · Mastercard · JCB", icon: CreditCard },
  { id: "online", label: "Online", hint: "GCash · Maya · Bank", icon: Globe },
];

/**
 * Shared payment interface reused by Events, Commerce, and Auto Care.
 * Real processing is intentionally mocked — `onPay` resolves after a short delay.
 */
export function PaymentPanel({
  summary,
  onPay,
  disabled,
  compact,
  defaultMethod = "card",
  ctaLabel,
  className,
}: {
  summary: PaymentSummary;
  onPay?: (method: PaymentMethod) => void;
  disabled?: boolean;
  compact?: boolean;
  defaultMethod?: PaymentMethod;
  ctaLabel?: string;
  className?: string;
}) {
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod);
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  const balance = summary.balance ?? summary.total - (summary.deposit ?? 0);
  const paid = summary.status === "paid" || state === "done";

  const pay = async () => {
    if (!onPay) return;
    setState("processing");
    await new Promise((r) => setTimeout(r, 1100));
    onPay(method);
    setState("done");
  };

  return (
    <div className={cn("surface rounded-2xl p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="eyebrow">Payment</p>
        {summary.status && <StatusBadge status={paid ? "paid" : summary.status} />}
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Subtotal" value={peso(summary.subtotal)} />
        {!!summary.discount && <Row label="Discount" value={`− ${peso(summary.discount)}`} className="text-success" />}
        {!!summary.tax && <Row label="Tax" value={peso(summary.tax)} />}
        <div className="my-2 border-t border-border" />
        <Row label="Total" value={peso(summary.total)} strong />
        {!!summary.deposit && <Row label="Deposit paid" value={`− ${peso(summary.deposit)}`} className="text-muted-foreground" />}
        {(summary.deposit || summary.balance !== undefined) && (
          <Row label="Balance due" value={peso(paid ? 0 : balance)} strong className={paid ? "text-success" : "text-module"} />
        )}
      </dl>

      {onPay && !paid && (
        <>
          <p className="eyebrow mt-6 mb-2">Method</p>
          <div className={cn("grid gap-2", compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")} role="radiogroup" aria-label="Payment method">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                disabled={disabled || state !== "idle"}
                className={cn(
                  "press flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors",
                  method === m.id ? "border-module bg-module-soft" : "border-border-strong hover:bg-accent",
                )}
              >
                <m.icon className={cn("size-4", method === m.id ? "text-module" : "text-muted-foreground")} />
                <span className="text-sm font-medium">{m.label}</span>
                {!compact && <span className="text-[11px] text-muted-foreground">{m.hint}</span>}
              </button>
            ))}
          </div>
          <Button size="lg" variant="module" className="mt-5 w-full" onClick={pay} disabled={disabled || state !== "idle"}>
            {state === "processing" ? (
              <>
                <Loader2 className="animate-spin" /> Processing…
              </>
            ) : (
              (ctaLabel ?? `Collect ${peso(balance)}`)
            )}
          </Button>
        </>
      )}

      <AnimatePresence>
        {paid && state === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-2 rounded-xl bg-success/12 px-3 py-2.5 text-sm text-success"
          >
            <CheckCircle2 className="size-4" /> Payment recorded via {methods.find((m) => m.id === method)?.label}.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, strong, className }: { label: string; value: string; strong?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <dt className={cn(strong ? "font-medium" : "text-muted-foreground")}>{label}</dt>
      <dd className={cn("tabular", strong && "text-base font-semibold")}>{value}</dd>
    </div>
  );
}
