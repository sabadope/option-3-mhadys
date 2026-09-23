import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, PageHeader, ProgressSteps, PersonCell, inputClass } from "@/components/kit";
import { ServiceCard } from "@/components/autocare/ServiceCard";
import { VehicleCard } from "@/components/autocare/VehicleCard";
import { bayAvailableForType, staffSkillMatch } from "@/components/autocare/lib";
import { useApp } from "@/lib/store";
import { addOns } from "@/data/autocare";
import { addMinutes, formatDate, minutesToLabel, peso, TODAY } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

export const Route = createFileRoute("/app/autocare/appointments/new")({
  head: () => ({
    meta: [
      { title: "New Appointment — Auto Care" },
      { name: "description", content: "Book a new car wash or detailing appointment." },
      { property: "og:title", content: "New Appointment — Auto Care" },
      { property: "og:description", content: "Step-by-step appointment booking wizard." },
    ],
  }),
  component: Wizard,
});

const STEPS = ["Customer", "Vehicle", "Service", "Add-ons", "Date & Time", "Bay & Staff", "Review", "Done"];
const SLOTS = Array.from({ length: 19 }, (_, i) => {
  const total = 8 * 60 + i * 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
});

function nextDays(n: number) {
  const out: string[] = [];
  const base = new Date(`${TODAY}T00:00:00`);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function Wizard() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [bayId, setBayId] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const service = state.services.find((s) => s.id === serviceId);
  const vehicles = state.vehicles.filter((v) => v.customerId === customerId);
  const days = nextDays(7);

  const durationMinutes = (service?.durationMinutes ?? 0) + addOnIds.reduce((sum, id) => sum + (addOns.find((a) => a.id === id)?.durationMinutes ?? 0), 0);
  const total = (service?.price ?? 0) + addOnIds.reduce((sum, id) => sum + (addOns.find((a) => a.id === id)?.price ?? 0), 0);

  const availableBays = service ? state.bays.filter((b) => bayAvailableForType(b, service.bayType)) : [];
  const availableStaff = service ? state.staff.filter((s) => staffSkillMatch(s, service.bayType) && s.status !== "off") : [];

  const canNext = () => {
    switch (step) {
      case 0: return !!customerId;
      case 1: return !!vehicleId;
      case 2: return !!serviceId;
      case 3: return true;
      case 4: return !!date && !!time;
      case 5: return !!bayId && !!staffId;
      case 6: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (!canNext()) {
      toast.error("Please complete this step first.");
      return;
    }
    if (step === 6) {
      const ap = actions.addAppointment({
        customerId: customerId!,
        vehicleId: vehicleId!,
        serviceId: serviceId!,
        addOnIds,
        date: date!,
        time: time!,
        durationMinutes,
        bayId: bayId!,
        staffId: staffId!,
        total,
      });
      setCreatedCode(ap.code);
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const toggleAddOn = (id: string) => setAddOnIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const reset = () => {
    setStep(0);
    setCustomerId(null);
    setVehicleId(null);
    setServiceId(null);
    setAddOnIds([]);
    setDate(null);
    setTime(null);
    setBayId(null);
    setStaffId(null);
    setCreatedCode(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Auto Care"
        title="New appointment"
        description="Book a vehicle in for service, step by step."
        actions={
          <Button variant="ghost" asChild>
            <Link to="/app/autocare/appointments"><ArrowLeft /> Back to appointments</Link>
          </Button>
        }
      />

      <div className="lg:hidden">
        <ProgressSteps steps={STEPS} currentIndex={step} />
        <p className="mt-2 text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ol className="space-y-1">
            {STEPS.map((label, i) => (
              <li key={label} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm", i === step && "bg-module-soft text-module font-medium", i < step && "text-muted-foreground")}>
                <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border text-[10px]", i < step ? "border-module bg-module text-module-foreground" : i === step ? "border-module text-module" : "border-border-strong text-muted-foreground")}>
                  {i < step ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </aside>

        <div className="surface min-h-[420px] rounded-2xl p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {step === 0 && (
                <StepBlock title="Select a customer">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {state.customers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setCustomerId(c.id); setVehicleId(null); }}
                        className={cn("surface-2 flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-accent/40", customerId === c.id && "ring-2 ring-module")}
                      >
                        <PersonCell name={c.name} sub={c.phone} />
                        {customerId === c.id && <Check className="size-4 text-module" />}
                      </button>
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 1 && (
                <StepBlock title="Select a vehicle" action={<Button size="sm" variant="secondary" onClick={() => setAddVehicleOpen(true)}><Plus /> Add vehicle</Button>}>
                  {vehicles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">This customer has no vehicles yet. Add one to continue.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {vehicles.map((v) => (
                        <VehicleCard key={v.id} vehicle={v} onClick={() => setVehicleId(v.id)} selected={vehicleId === v.id} />
                      ))}
                    </div>
                  )}
                </StepBlock>
              )}

              {step === 2 && (
                <StepBlock title="Choose a service">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {state.services.filter((s) => s.status === "active").map((s) => (
                      <ServiceCard key={s.id} service={s} onClick={() => setServiceId(s.id)} selected={serviceId === s.id} />
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 3 && (
                <StepBlock title="Add-ons" action={<span className="text-xs text-muted-foreground">Optional</span>}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {addOns.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddOn(a.id)}
                        className={cn("surface-2 flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-accent/40", addOnIds.includes(a.id) && "ring-2 ring-module")}
                      >
                        <div>
                          <p className="text-sm font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{minutesToLabel(a.durationMinutes)}</p>
                        </div>
                        <span className="tabular text-sm font-semibold">{peso(a.price)}</span>
                      </button>
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 4 && (
                <StepBlock title="Pick date & time">
                  <p className="eyebrow mb-2">Date</p>
                  <div className="flex flex-wrap gap-2">
                    {days.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={cn("rounded-full border px-3.5 py-2 text-sm transition-colors", date === d ? "border-module bg-module-soft text-module font-medium" : "border-border-strong hover:bg-accent")}
                      >
                        {formatDate(d, "EEE, MMM d")}
                      </button>
                    ))}
                  </div>
                  <p className="eyebrow mb-2 mt-6">Time</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {SLOTS.map((t) => {
                      const end = addMinutes(t, durationMinutes || 30);
                      const conflict =
                        date &&
                        state.appointments.some(
                          (a) => a.date === date && a.status !== "cancelled" && a.time < end && t < addMinutes(a.time, a.durationMinutes) && (a.bayId === bayId || a.staffId === staffId) && (bayId || staffId),
                        );
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!date}
                          onClick={() => setTime(t)}
                          className={cn("rounded-lg border px-2 py-2 text-xs font-medium tabular transition-colors disabled:opacity-40", time === t ? "border-module bg-module-soft text-module" : "border-border-strong hover:bg-accent", conflict && "opacity-50")}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </StepBlock>
              )}

              {step === 5 && (
                <StepBlock title="Assign bay & staff">
                  <p className="eyebrow mb-2">Bay ({service ? service.bayType : "—"})</p>
                  <div className="grid gap-2 sm:grid-cols-3 mb-6">
                    {availableBays.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBayId(b.id)}
                        className={cn("surface-2 rounded-xl p-3 text-left transition-colors hover:bg-accent/40", bayId === b.id && "ring-2 ring-module")}
                      >
                        <p className="text-sm font-medium">Bay {b.number}</p>
                        <p className="text-xs text-muted-foreground">{b.name}</p>
                      </button>
                    ))}
                    {availableBays.length === 0 && <p className="text-sm text-muted-foreground">No available bays for this service type.</p>}
                  </div>
                  <p className="eyebrow mb-2">Staff</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {availableStaff.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStaffId(s.id)}
                        className={cn("surface-2 rounded-xl p-3 text-left transition-colors hover:bg-accent/40", staffId === s.id && "ring-2 ring-module")}
                      >
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.role}</p>
                      </button>
                    ))}
                    {availableStaff.length === 0 && <p className="text-sm text-muted-foreground">No staff with matching skills available.</p>}
                  </div>
                </StepBlock>
              )}

              {step === 6 && (() => {
                const c = state.customers.find((x) => x.id === customerId);
                const v = state.vehicles.find((x) => x.id === vehicleId);
                const bay = state.bays.find((b) => b.id === bayId);
                const st = state.staff.find((s) => s.id === staffId);
                return (
                  <StepBlock title="Review & confirm">
                    <div className="space-y-3 text-sm">
                      <Row label="Customer" value={c?.name ?? "—"} />
                      <Row label="Vehicle" value={v ? `${v.make} ${v.model} · ${v.plate}` : "—"} />
                      <Row label="Service" value={service?.name ?? "—"} />
                      {addOnIds.length > 0 && <Row label="Add-ons" value={addOnIds.map((id) => addOns.find((a) => a.id === id)?.name).join(", ")} />}
                      <Row label="Date & time" value={date && time ? `${formatDate(date)} · ${time}` : "—"} />
                      <Row label="Duration" value={minutesToLabel(durationMinutes)} />
                      <Row label="Bay" value={bay ? `Bay ${bay.number}` : "—"} />
                      <Row label="Staff" value={st?.name ?? "—"} />
                      <div className="border-t border-border pt-3">
                        <Row label="Total" value={peso(total)} strong />
                      </div>
                    </div>
                  </StepBlock>
                );
              })()}

              {step === 7 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 grid size-16 place-items-center rounded-full bg-success/12 text-success">
                    <CheckCircle2 className="size-8" />
                  </motion.div>
                  <h2 className="text-xl font-semibold tracking-tight">Appointment booked!</h2>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">{createdCode}</p>
                  <div className="mt-6 flex gap-3">
                    <Button variant="secondary" onClick={reset}>Book another</Button>
                    <Button variant="module" onClick={() => navigate({ to: "/app/autocare/appointments" })}>View appointments</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 7 && (
            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}><ArrowLeft /> Back</Button>
              <Button variant="module" onClick={goNext}>
                {step === 6 ? "Confirm booking" : "Continue"} <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddVehicleDialog
        open={addVehicleOpen}
        onOpenChange={setAddVehicleOpen}
        customerId={customerId}
        onCreated={(v) => setVehicleId(v.id)}
      />
    </div>
  );
}

function StepBlock({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(strong && "text-base font-semibold")}>{value}</span>
    </div>
  );
}

function AddVehicleDialog({ open, onOpenChange, customerId, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; customerId: string | null; onCreated: (v: Vehicle) => void }) {
  const { actions } = useApp();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState<Vehicle["type"]>("sedan");

  const submit = () => {
    if (!customerId || !make.trim() || !model.trim() || !plate.trim()) {
      toast.error("Fill in make, model, and plate.");
      return;
    }
    const v = actions.addVehicle({ customerId, make, model, year: Number(year) || new Date().getFullYear(), plate, color: color || "Unknown", type });
    toast.success("Vehicle added");
    onCreated(v);
    onOpenChange(false);
    setMake(""); setModel(""); setPlate(""); setColor("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong rounded-3xl border">
        <DialogHeader>
          <DialogTitle>Add vehicle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Make" htmlFor="v-make"><Input id="v-make" className={inputClass} value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" /></FormField>
            <FormField label="Model" htmlFor="v-model"><Input id="v-model" className={inputClass} value={model} onChange={(e) => setModel(e.target.value)} placeholder="Vios" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Year" htmlFor="v-year"><Input id="v-year" type="number" className={inputClass} value={year} onChange={(e) => setYear(e.target.value)} /></FormField>
            <FormField label="Plate" htmlFor="v-plate"><Input id="v-plate" className={inputClass} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC 1234" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Color" htmlFor="v-color"><Input id="v-color" className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} placeholder="White" /></FormField>
            <FormField label="Type" htmlFor="v-type">
              <Select value={type} onValueChange={(v) => setType(v as Vehicle["type"])}>
                <SelectTrigger id="v-type" className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["sedan", "suv", "pickup", "coupe", "hatchback", "van"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
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
