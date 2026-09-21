import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, inputClass } from "@/components/kit";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Product, ProductVariant } from "@/types";

const REASONS = ["Received shipment", "Damaged", "Correction", "Returned"];

export function StockAdjustDialog({
  open,
  onOpenChange,
  product,
  variant,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product: Product | undefined;
  variant: ProductVariant | undefined;
}) {
  const { actions } = useApp();
  const [delta, setDelta] = useState(1);
  const [reason, setReason] = useState(REASONS[0]!);

  if (!product || !variant) return null;

  const apply = () => {
    if (delta === 0) return;
    actions.adjustStock(variant.id, delta);
    toast.success(`Stock ${delta > 0 ? "increased" : "decreased"}`, {
      description: `${product.name} · ${variant.name} · ${reason}`,
    });
    onOpenChange(false);
    setDelta(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong rounded-3xl border">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{variant.name} · {variant.sku}</p>
            <p className="mt-1 text-xs text-muted-foreground">Current stock: {variant.stock}</p>
          </div>
          <FormField label="Adjustment">
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" size="icon" aria-label="Decrease" onClick={() => setDelta((d) => d - 1)}>
                <Minus />
              </Button>
              <span className="tabular w-16 text-center text-lg font-semibold">{delta > 0 ? `+${delta}` : delta}</span>
              <Button type="button" variant="secondary" size="icon" aria-label="Increase" onClick={() => setDelta((d) => d + 1)}>
                <Plus />
              </Button>
            </div>
          </FormField>
          <FormField label="Reason">
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="module" onClick={apply} disabled={delta === 0}>
            Apply adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
