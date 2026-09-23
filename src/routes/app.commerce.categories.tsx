import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, FormField, PageHeader, PageSkeleton, inputClass } from "@/components/kit";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useApp } from "@/lib/store";
import { categories as seedCategories } from "@/data/commerce";
import { nextId } from "@/lib/format";
import type { Category } from "@/types";

export const Route = createFileRoute("/app/commerce/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Nimbus Commerce" },
      { name: "description", content: "Organize your merchandise catalog into categories." },
      { property: "og:title", content: "Categories — Nimbus Commerce" },
      { property: "og:description", content: "Manage product categories and see product counts." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const loading = useSimulatedLoading();
  const { state } = useApp();
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (loading) return <PageSkeleton />;

  const countFor = (catId: string) => state.products.filter((p) => p.categoryId === catId).length;

  const submit = () => {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const category: Category = {
      id: nextId("cat"),
      name: name.trim(),
      slug: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      description: description.trim(),
      productCount: 0,
    };
    setCategories((c) => [category, ...c]);
    toast.success("Category added", { description: category.name });
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commerce"
        title="Categories"
        description="Group merchandise into shoppable categories."
        actions={
          <Button variant="module" onClick={() => setOpen(true)}>
            <Plus /> Add category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState icon={<Layers />} title="No categories yet" description="Add your first category to organize products." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const products = state.products.filter((p) => p.categoryId === c.id);
            return (
              <div key={c.id} className="surface overflow-hidden rounded-2xl">
                <div className="grid grid-cols-3 gap-0.5 bg-surface-2">
                  {(products.length > 0 ? products.slice(0, 3) : [undefined, undefined, undefined]).map((p, i) => (
                    <div key={p?.id ?? i} className="aspect-square overflow-hidden bg-surface-2">
                      {p?.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-[15px] font-semibold tracking-tight">{c.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-3 text-xs font-medium text-module">{countFor(c.id)} product{countFor(c.id) === 1 ? "" : "s"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-3xl border">
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField label="Name" htmlFor="cat-name" required>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Outerwear" />
            </FormField>
            <FormField label="Description" htmlFor="cat-desc">
              <Textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="module" onClick={submit}>
              Add category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
