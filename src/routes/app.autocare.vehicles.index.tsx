import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, FormField, EmptyState, Chip, inputClass, PageSkeleton } from "@/components/kit";
import { VehicleCard } from "@/components/autocare/VehicleCard";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Vehicle } from "@/types";

export const Route = createFileRoute("/app/autocare/vehicles/")({
  head: () => ({
    meta: [
      { title: "Vehicles — Auto Care" },
      { name: "description", content: "Registered customer vehicles and their service history." },
      { property: "og:title", content: "Vehicles — Auto Care" },
      { property: "og:description", content: "Browse vehicles by plate, model, or owner." },
    ],
  }),
  component: Page,
});

const TYPES: Vehicle["type"][] = ["sedan", "suv", "pickup", "coupe", "hatchback", "van"];

function Page() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const loading = useSimulatedLoading(400);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return state.vehicles.filter((v) => {
      const owner = state.customers.find((c) => c.id === v.customerId);
      const matchesQ = !q || `${v.plate} ${v.make} ${v.model} ${owner?.name ?? ""}`.toLowerCase().includes(q.toLowerCase());
      const matchesType = !type || v.type === type;
      return matchesQ && matchesType;
    });
  }, [state.vehicles, state.customers, q, type]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="Vehicles"
        description="Every vehicle that has come through your bays."
        actions={<Button variant="module" onClick={() => setOpen(true)}><Plus /> Add vehicle</Button>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plate, model, or owner…" className="h-10 max-w-xs rounded-full border-border-strong bg-surface-2" />
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-surface-2 p-1">
          <Chip selected={!type} onClick={() => setType("")}>All</Chip>
          {TYPES.map((t) => (
            <Chip key={t} selected={type === t} onClick={() => setType(t)}>{t}</Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Add your first vehicle." description="Vehicles you register will appear here with full service history." icon={<Car />} action={<Button variant="module" onClick={() => setOpen(true)}><Plus /> Add vehicle</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => {
            const owner = state.customers.find((c) => c.id === v.customerId);
            const visits = state.appointments.filter((a) => a.vehicleId === v.id && a.status === "completed").length;
            return (
              <VehicleCard
                key={v.id}
                vehicle={v}
                ownerName={owner?.name}
                visits={visits}
                onClick={() => navigate({ to: "/app/autocare/vehicles/$vehicleId", params: { vehicleId: v.id } })}
              />
            );
          })}
        </div>
      )}

      <AddVehicleDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function AddVehicleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, actions } = useApp();
  const [customerId, setCustomerId] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [vtype, setVtype] = useState<Vehicle["type"]>("sedan");

  const submit = () => {
    if (!customerId || !make.trim() || !model.trim() || !plate.trim()) {
      toast.error("Fill in owner, make, model, and plate.");
      return;
    }
    actions.addVehicle({ customerId, make, model, year: Number(year) || new Date().getFullYear(), plate, color: color || "Unknown", type: vtype });
    toast.success("Vehicle added");
    onOpenChange(false);
    setCustomerId(""); setMake(""); setModel(""); setPlate(""); setColor("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong rounded-3xl border">
        <DialogHeader><DialogTitle>Add vehicle</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <FormField label="Owner" htmlFor="ao-owner">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="ao-owner" className={inputClass}><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {state.customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Make" htmlFor="ao-make"><Input id="ao-make" className={inputClass} value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" /></FormField>
            <FormField label="Model" htmlFor="ao-model"><Input id="ao-model" className={inputClass} value={model} onChange={(e) => setModel(e.target.value)} placeholder="Vios" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Year" htmlFor="ao-year"><Input id="ao-year" type="number" className={inputClass} value={year} onChange={(e) => setYear(e.target.value)} /></FormField>
            <FormField label="Plate" htmlFor="ao-plate"><Input id="ao-plate" className={inputClass} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC 1234" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Color" htmlFor="ao-color"><Input id="ao-color" className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} placeholder="White" /></FormField>
            <FormField label="Type" htmlFor="ao-type">
              <Select value={vtype} onValueChange={(v) => setVtype(v as Vehicle["type"])}>
                <SelectTrigger id="ao-type" className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <Button variant="module" onClick={submit}>Save vehicle</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
