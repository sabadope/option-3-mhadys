import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Percent, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, FormField, PageHeader, PageSkeleton, inputClass } from "@/components/kit";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp } from "@/lib/store";
import { formatDate, peso } from "@/lib/format";
import type { Discount } from "@/types";

export const Route = createFileRoute("/app/commerce/discounts")({
  head: () => ({
    meta: [
      { title: "Discounts — Nimbus Commerce" },
      { name: "description", content: "Manage promotional codes for the storefront." },
      { property: "og:title", content: "Discounts — Nimbus Commerce" },
      { property: "og:description", content: "Create and toggle discount codes." },
    ],
  }),
  component: DiscountsPage,
});

function DiscountsPage() {
  const loading = useSimulatedLoading();
  const { state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<Discount["type"]>("percent");
  const [value, setValue] = useState("10");
  const [limit, setLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  if (loading) return <PageSkeleton />;

  const submit = () => {
    if (!code.trim()) {
      toast.error("Discount code is required.");
      return;
    }
    actions.addDiscount({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value) || 0,
      limit: limit ? Number(limit) : undefined,
      active: true,
      expiresAt: expiresAt || undefined,
    });
    toast.success("Discount created", { description: code.trim().toUpperCase() });
    setOpen(false);
    setCode("");
    setValue("10");
    setLimit("");
    setExpiresAt("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="Discounts"
        description="Promotional codes shoppers can apply at checkout."
        actions={
          <Button variant="module" onClick={() => setOpen(true)}>
            <Plus /> Create discount
          </Button>
        }
      />

      {state.discounts.length === 0 ? (
        <EmptyState icon={<Percent />} title="No discounts yet" description="Create a code to run your first promotion." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.discounts.map((d) => {
            const pct = d.limit ? Math.min(100, (d.usage / d.limit) * 100) : undefined;
            return (
              <div key={d.id} className="surface rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-lg font-semibold tracking-tight">{d.code}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {d.type === "percent" ? `${d.value}% off` : `${peso(d.value)} off`}
                    </p>
                  </div>
                  <Switch checked={d.active} onCheckedChange={() => actions.toggleDiscount(d.id)} aria-label={`Toggle ${d.code}`} />
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Usage</span>
                    <span className="tabular">{d.usage}{d.limit ? ` / ${d.limit}` : ""}</span>
                  </div>
                  {pct !== undefined && (
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-module" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {d.expiresAt ? `Expires ${formatDate(d.expiresAt)}` : "No expiry"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-3xl border">
          <DialogHeader>
            <DialogTitle>Create discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField label="Code" htmlFor="d-code" required>
              <Input id="d-code" value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} placeholder="e.g. SAVE15" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <Select value={type} onValueChange={(v) => setType(v as Discount["type"])}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent</SelectItem>
                    <SelectItem value="fixed">Fixed (₱)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Value">
                <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Usage limit" hint="optional">
                <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Expires" hint="optional">
                <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={inputClass} />
              </FormField>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="module" onClick={submit}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
