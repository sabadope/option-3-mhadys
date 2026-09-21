import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, inputClass } from "@/components/kit";
import { nextId } from "@/lib/format";

export interface VariantDraft {
  id: string;
  option1: string;
  option2: string;
  sku: string;
  price: number;
  stock: number;
}

export function VariantEditor({
  variants,
  onChange,
  baseSku,
  basePrice,
}: {
  variants: VariantDraft[];
  onChange: (v: VariantDraft[]) => void;
  baseSku: string;
  basePrice: number;
}) {
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");

  const update = (id: string, changes: Partial<VariantDraft>) =>
    onChange(variants.map((v) => (v.id === id ? { ...v, ...changes } : v)));

  const remove = (id: string) => onChange(variants.filter((v) => v.id !== id));

  const addRow = () =>
    onChange([...variants, { id: nextId("draft"), option1: "", option2: "", sku: "", price: basePrice, stock: 0 }]);

  const generate = () => {
    const colorList = colors.split(",").map((c) => c.trim()).filter(Boolean);
    const sizeList = sizes.split(",").map((s) => s.trim()).filter(Boolean);
    if (colorList.length === 0) return;
    const combos = sizeList.length > 0 ? colorList.flatMap((c) => sizeList.map((s) => ({ c, s }))) : colorList.map((c) => ({ c, s: "" }));
    const generated: VariantDraft[] = combos.map(({ c, s }) => ({
      id: nextId("draft"),
      option1: c,
      option2: s,
      sku: `${baseSku}-${c.slice(0, 2).toUpperCase()}${s ? `-${s.toUpperCase()}` : ""}`,
      price: basePrice,
      stock: 0,
    }));
    onChange(generated);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-dashed border-border-strong p-4 sm:grid-cols-[1fr_1fr_auto]">
        <FormField label="Colors" hint="comma separated">
          <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Black, Bone" className={inputClass} />
        </FormField>
        <FormField label="Sizes" hint="comma separated, optional">
          <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" className={inputClass} />
        </FormField>
        <div className="flex items-end">
          <Button type="button" variant="secondary" onClick={generate} className="w-full sm:w-auto">
            <Wand2 /> Generate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {variants.map((v) => (
          <div key={v.id} className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1fr_1fr_1.2fr_0.8fr_0.7fr_auto] sm:items-center">
            <Input value={v.option1} onChange={(e) => update(v.id, { option1: e.target.value })} placeholder="Color" className={inputClass} aria-label="Color" />
            <Input value={v.option2} onChange={(e) => update(v.id, { option2: e.target.value })} placeholder="Size" className={inputClass} aria-label="Size" />
            <Input value={v.sku} onChange={(e) => update(v.id, { sku: e.target.value })} placeholder="SKU" className={inputClass} aria-label="SKU" />
            <Input
              type="number"
              value={v.price}
              onChange={(e) => update(v.id, { price: Number(e.target.value) })}
              placeholder="Price"
              className={inputClass}
              aria-label="Price"
            />
            <Input
              type="number"
              value={v.stock}
              onChange={(e) => update(v.id, { stock: Number(e.target.value) })}
              placeholder="Stock"
              className={inputClass}
              aria-label="Stock"
            />
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove variant" onClick={() => remove(v.id)}>
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus /> Add variant row
      </Button>
    </div>
  );
}
