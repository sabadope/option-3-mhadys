import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHeader, PageSkeleton, PaymentPanel, SectionCard, StatusBadge } from "@/components/kit";
import { VehicleBadge } from "@/components/autocare/VehicleBadge";
import { ServiceTimeline } from "@/components/autocare/ServiceTimeline";
import { addOnById, addOnsTotal, checklistProgress, serviceById, WO_STEPS } from "@/components/autocare/lib";
import { useApp } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { humanize, peso } from "@/lib/format";

export const Route = createFileRoute("/app/autocare/work-orders/$workOrderId")({
  head: () => ({
    meta: [
      { title: "Work Order — Auto Care" },
      { name: "description", content: "Work order timeline, checklist, and payment." },
      { property: "og:title", content: "Work Order — Auto Care" },
      { property: "og:description", content: "Advance status, assign staff and bay, and collect payment." },
    ],
  }),
  component: Page,
});

function Page() {
  const loading = useSimulatedLoading();
  const { workOrderId } = Route.useParams();
  const { state, actions } = useApp();
  const [notes, setNotes] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);

  if (loading) return <PageSkeleton />;

  const wo = state.workOrders.find((w) => w.id === workOrderId);
  if (!wo) {
    return (
      <EmptyState
        title="Work order not found"
        action={<Button asChild variant="module"><Link to="/app/autocare/work-orders">Back to work orders</Link></Button>}
      />
    );
  }

  const vehicle = state.vehicles.find((v) => v.id === wo.vehicleId);
  const service = serviceById(wo.serviceId);
  const appointment = state.appointments.find((a) => a.id === wo.appointmentId);
  const payment = state.payments.find((p) => p.referenceId === wo.id);
  const progress = checklistProgress(wo);
  const nextIdx = WO_STEPS.findIndex((s) => s.key === wo.status) + 1;
  const nextLabel = WO_STEPS[nextIdx]?.label;
  const total = appointment?.total ?? (service?.price ?? 0) + addOnsTotal(wo.addOnIds);

  const advance = async () => {
    setAdvancing(true);
    await new Promise((r) => setTimeout(r, 350));
    actions.advanceWorkOrder(wo.id);
    setAdvancing(false);
    toast.success(`Advanced to ${nextLabel}`);
  };

  const saveNotes = () => {
    actions.updateWorkOrder(wo.id, { notes: notes ?? wo.notes });
    toast.success("Notes saved");
  };

  const addPhoto = (kind: "before" | "after") => {
    const url = `https://picsum.photos/seed/${wo.id}-${kind}-${(kind === "before" ? wo.beforePhotos : wo.afterPhotos).length}/300/200`;
    actions.updateWorkOrder(wo.id, kind === "before" ? { beforePhotos: [...wo.beforePhotos, url] } : { afterPhotos: [...wo.afterPhotos, url] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Work order"
        title={wo.code}
        description={vehicle ? `${vehicle.make} ${vehicle.model} · ${vehicle.plate}` : undefined}
        actions={
          <>
            <Button variant="ghost" asChild><Link to="/app/autocare/work-orders"><ArrowLeft /> Back</Link></Button>
            {nextLabel && (
              <Button variant="module" onClick={advance} disabled={advancing}>
                Advance to {nextLabel} <ArrowRight />
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <SectionCard title="Timeline" eyebrow={<StatusBadge status={wo.status} /> as unknown as string}>
            <ServiceTimeline wo={wo} />
          </SectionCard>

          <SectionCard title="Assignment">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Staff</p>
                <Select value={wo.staffId ?? ""} onValueChange={(v) => actions.updateWorkOrder(wo.id, { staffId: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-border-strong bg-surface-2"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>{state.staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className="eyebrow mb-2">Bay</p>
                <Select value={wo.bayId ?? ""} onValueChange={(v) => actions.updateWorkOrder(wo.id, { bayId: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-border-strong bg-surface-2"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>{state.bays.map((b) => <SelectItem key={b.id} value={b.id}>Bay {b.number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Service & pricing">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>{service?.name}</span><span className="tabular">{peso(service?.price ?? 0)}</span></div>
              {wo.addOnIds.map((id) => {
                const a = addOnById(id);
                return a ? <div key={id} className="flex items-center justify-between text-muted-foreground"><span>+ {a.name}</span><span className="tabular">{peso(a.price)}</span></div> : null;
              })}
              <div className="border-t border-border pt-2 flex items-center justify-between font-semibold"><span>Total</span><span className="tabular">{peso(total)}</span></div>
            </div>
          </SectionCard>

          <SectionCard title="Notes">
            <Textarea defaultValue={wo.notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add notes about this job…" />
            <Button size="sm" variant="secondary" className="mt-3" onClick={saveNotes}>Save notes</Button>
          </SectionCard>

          <SectionCard title="Checklist" eyebrow={`${Math.round(progress * 100)}% complete`}>
            <ul className="space-y-2">
              {wo.checklist.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => actions.toggleChecklist(wo.id, c.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent/40"
                  >
                    <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${c.done ? "border-module bg-module text-module-foreground" : "border-border-strong"}`}>
                      {c.done && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <SectionCard title="Before photos">
              <PhotoGrid photos={wo.beforePhotos} onAdd={() => addPhoto("before")} />
            </SectionCard>
            <SectionCard title="After photos">
              <PhotoGrid photos={wo.afterPhotos} onAdd={() => addPhoto("after")} />
            </SectionCard>
          </div>
        </div>

        <div className="space-y-4">
          {vehicle && <SectionCard><VehicleBadge vehicle={vehicle} /></SectionCard>}
          <PaymentPanel
            summary={{ subtotal: total, total, balance: payment?.balance ?? total, status: payment?.status ?? "unpaid" }}
            onPay={(method) =>
              actions.recordPayment({
                module: "autocare",
                referenceId: wo.id,
                referenceCode: wo.code,
                customerId: wo.customerId,
                subtotal: total,
                discount: 0,
                tax: 0,
                deposit: 0,
                total,
                method,
                amountPaid: total,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function PhotoGrid({ photos, onAdd }: { photos: string[]; onAdd: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        <img key={i} src={p} alt="" className="aspect-video w-full rounded-lg object-cover" />
      ))}
      <button type="button" onClick={onAdd} className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border-strong text-muted-foreground hover:bg-accent/40">
        <Camera className="size-4" />
      </button>
    </div>
  );
}
