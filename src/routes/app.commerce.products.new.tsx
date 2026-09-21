import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormSection, PageHeader, inputClass } from "@/components/kit";
import { VariantEditor, type VariantDraft } from "@/components/commerce/VariantEditor";
import { useApp } from "@/lib/store";
import { categories } from "@/data/commerce";
import { nextId } from "@/lib/format";
import hoodie from "@/assets/products/hoodie.jpg";
import shirt from "@/assets/products/shirt.jpg";
import cap from "@/assets/products/cap.jpg";
import jacket from "@/assets/products/jacket.jpg";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types";

export const Route = createFileRoute("/app/commerce/products/new")({
  head: () => ({
    meta: [
      { title: "New product — Nimbus Commerce" },
      { name: "description", content: "Add a new product to your merchandise catalog." },
      { property: "og:title", content: "New product — Nimbus Commerce" },
      { property: "og:description", content: "Create products with variants, pricing, and inventory." },
    ],
  }),
  component: NewProduct,
});

const IMAGE_OPTIONS = [
  { src: hoodie, label: "Hoodie" },
  { src: shirt, label: "Shirt" },
  { src: cap, label: "Cap" },
  { src: jacket, label: "Jacket" },
];

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function skuFromName(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w.slice(0, 2).toUpperCase())
    .join("")
    .slice(0, 6);
  return letters ? `NMB-${letters}-${Math.floor(Math.random() * 900 + 100)}` : "";
}

function NewProduct() {
  const navigate = useNavigate();
  const { actions } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(IMAGE_OPTIONS[0]!.src);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [sku, setSku] = useState("");
  const [skuTouched, setSkuTouched] = useState(false);
  const [price, setPrice] = useState("");
  const [compareAt, setCompareAt] = useState("");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [variants, setVariants] = useState<VariantDraft[]>([
    { id: nextId("draft"), option1: "", option2: "", sku: "", price: 0, stock: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const effectiveSku = skuTouched ? sku : sku || skuFromName(name);

  const onNameChange = (v: string) => {
    setName(v);
    if (!skuTouched) setSku(skuFromName(v));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Product name is required.";
    if (!description.trim()) e.description = "Add a short description.";
    if (!price || Number(price) <= 0) e.price = "Enter a valid price.";
    if (compareAt && Number(compareAt) <= Number(price)) e.compareAt = "Compare-at price should be higher than price.";
    if (variants.some((v) => !v.option1.trim() || !v.sku.trim())) e.variants = "Every variant needs a color and SKU.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      toast.error("Fix the highlighted fields before saving.");
      return;
    }
    const product = actions.addProduct({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
      images: [image],
      categoryId,
      sku: effectiveSku,
      price: Number(price),
      compareAtPrice: compareAt ? Number(compareAt) : undefined,
      status,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      variants: variants.map((v) => ({
        id: nextId("v"),
        productId: "",
        name: `${v.option1}${v.option2 ? ` / ${v.option2}` : ""}`,
        option1: v.option1,
        option2: v.option2 || undefined,
        sku: v.sku,
        price: v.price || Number(price),
        stock: v.stock,
      })),
    });
    toast.success("Product created", { description: `${product.name} was added to your catalog.` });
    navigate({ to: "/app/commerce/products/$productId", params: { productId: product.id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="New product"
        description="Add a new item to your merchandise catalog."
        actions={
          <Button asChild variant="ghost">
            <Link to="/app/commerce/products">
              <ArrowLeft /> Back to products
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <FormSection title="Product image" description="Choose an image from your product photography.">
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface-2">
            <img src={image} alt="Selected product" className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {IMAGE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setImage(opt.src)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl ring-2 transition-all",
                  image === opt.src ? "ring-module" : "ring-transparent hover:ring-border-strong",
                )}
                aria-label={`Use ${opt.label} image`}
              >
                <img src={opt.src} alt={opt.label} className="h-full w-full object-cover" />
                {image === opt.src && (
                  <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-module text-module-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </FormSection>

        <div className="space-y-6">
          <FormSection title="Details">
            <FormField label="Name" htmlFor="p-name" required error={errors.name}>
              <Input id="p-name" value={name} onChange={(e) => onNameChange(e.target.value)} className={inputClass} placeholder="e.g. Premium Hoodie" />
            </FormField>
            <FormField label="Description" htmlFor="p-desc" required error={errors.description}>
              <Textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Fabric, fit, and story of the product…" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category" htmlFor="p-cat">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="p-cat" className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="SKU" htmlFor="p-sku" hint="Auto-suggested from name">
                <Input
                  id="p-sku"
                  value={effectiveSku}
                  onChange={(e) => {
                    setSkuTouched(true);
                    setSku(e.target.value);
                  }}
                  className={inputClass}
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Price (₱)" htmlFor="p-price" required error={errors.price}>
                <Input id="p-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Compare-at (₱)" htmlFor="p-compare" error={errors.compareAt}>
                <Input id="p-compare" type="number" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Low stock at" htmlFor="p-low">
                <Input id="p-low" type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Status" htmlFor="p-status">
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                <SelectTrigger id="p-status" className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>

          <FormSection title="Variants" description="Add colors and sizes with individual SKUs, prices, and stock.">
            <VariantEditor variants={variants} onChange={setVariants} baseSku={effectiveSku || "NMB-NEW"} basePrice={Number(price) || 0} />
            {errors.variants && <p className="text-xs text-destructive">{errors.variants}</p>}
          </FormSection>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" asChild>
              <Link to="/app/commerce/products">Cancel</Link>
            </Button>
            <Button variant="module" onClick={submit}>
              Save product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
