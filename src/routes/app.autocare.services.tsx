import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, PageHeader, PageSkeleton, inputClass } from "@/components/kit";
import { ServiceCard } from "@/components/autocare/ServiceCard";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { humanize } from "@/lib/format";
import type { Service } from "@/types";

export const Route = createFileRoute("/app/autocare/services")({
  head: () => ({
    meta: [
      { title: "Services — Auto Care" },
      { name: "description", content: "Manage your car wash and detailing service catalog." },
      { property: "og:title", content: "Services — Auto Care" },
      { property: "og:description", content: "Grouped by category, with pricing and availability controls." },
    ],
  }),
  component: Page,
});

const CATEGORIES: Service["category"][] = ["wash", "interior", "exterior", "detailing", "protection"];
const BAY_TYPES: Service["bayType"][] = ["wash", "detail", "coating"];

function emptyForm(): Omit<Service, "id"> {
  return { name: "", description: "", price: 0, durationMinutes: 30, bayType: "wash", status: "active", category: "wash" };
}

function Page() {
  const { state, actions } = useApp();
  const loading = useSimulatedLoading(400);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm());

  const filtered = useMemo(
    () => state.services.filter((s) => !q || `${s.name} ${s.description}`.toLowerCase().includes(q.toLowerCase())),
    [state.services, q],
  );

  const grouped = CATEGORIES.map((cat) => ({ cat, items: filtered.filter((s) => s.category === cat) })).filter((g) => g.items.length > 0);

  const openNew = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, description: s.description, price: s.price, durationMinutes: s.durationMinutes, bayType: s.bayType, status: s.status, category: s.category }); setOpen(true); };

  const save = () => {
    if (!form.name.trim()) { toast.error("Service name is required."); return; }
    if (editing) {
      actions.updateService(editing.id, form);
      toast.success("Service updated");
    } else {
      actions.addService(form);
      toast.success("Service added");
    }
    setOpen(false);
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="Services"
        description="Your service catalog, grouped by category."
        actions={<Button variant="module" onClick={openNew}><Plus /> New service</Button>}
      />

      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className="h-10 max-w-xs rounded-full border-border-strong bg-surface-2" />

      <div className="space-y-8">
        {grouped.map((g) => (
          <div key={g.cat}>
            <h3 className="mb-3 text-sm font-semibold tracking-tight">{humanize(g.cat)}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((s) => (
                <ServiceCard key={s.id} service={s} onClick={() => openEdit(s)} onToggleStatus={(active) => actions.updateService(s.id, { status: active ? "active" : "inactive" })} />
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && <p className="text-sm text-muted-foreground">No services match your search.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-3xl border">
          <DialogHeader><DialogTitle>{editing ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <FormField label="Name" htmlFor="s-name"><Input id="s-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Description" htmlFor="s-desc"><Textarea id="s-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Price (₱)" htmlFor="s-price"><Input id="s-price" type="number" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></FormField>
              <FormField label="Duration (min)" htmlFor="s-dur"><Input id="s-dur" type="number" className={inputClass} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category" htmlFor="s-cat">
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Service["category"] })}>
                  <SelectTrigger id="s-cat" className={inputClass}><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Bay type" htmlFor="s-bay">
                <Select value={form.bayType} onValueChange={(v) => setForm({ ...form, bayType: v as Service["bayType"] })}>
                  <SelectTrigger id="s-bay" className={inputClass}><SelectValue /></SelectTrigger>
                  <SelectContent>{BAY_TYPES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            </div>
            <Button variant="module" onClick={save}>{editing ? "Save changes" : "Create service"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
