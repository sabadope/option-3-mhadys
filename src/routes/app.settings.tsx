import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Building2, CreditCard, Palette, Plus, User, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField, FormSection, InitialsAvatar, inputClass, PageHeader, StatusBadge } from "@/components/kit";
import { business, currentUser } from "@/data/customers";
import { staff } from "@/data/autocare";
import { plans } from "./pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nimbus" },
      { name: "description", content: "Business profile, account, team, notifications, appearance, and billing settings." },
      { property: "og:title", content: "Settings — Nimbus" },
      { property: "og:description", content: "Manage your Nimbus workspace." },
    ],
  }),
  component: Page,
});

const sections = [
  { id: "business", label: "Business profile", icon: Building2 },
  { id: "account", label: "Account", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing", icon: CreditCard },
] as const;
type SectionId = (typeof sections)[number]["id"];

function Page() {
  const [active, setActive] = useState<SectionId>("business");
  const [biz, setBiz] = useState(business);
  const [me, setMe] = useState(currentUser);
  const [notif, setNotif] = useState({ bookings: true, orders: true, appointments: true, lowStock: true, weekly: false, sms: false });
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [accent, setAccent] = useState<"module" | "neutral">("module");
  const save = (what: string) => toast.success(`${what} saved`);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Workspace" title="Settings" description="Configure how Nimbus works for your business." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col" aria-label="Settings sections">
          {sections.map((s) => (
            <button key={s.id} type="button" onClick={() => setActive(s.id)} className={cn("relative flex h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors", active === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {active === s.id && <motion.span layoutId="settings-active" className="absolute inset-0 rounded-xl bg-accent" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <s.icon className="relative size-4" />
              <span className="relative whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="max-w-2xl space-y-4">
            {active === "business" && (
              <FormSection title="Business profile" description="Shown on tickets, receipts, and the storefront.">
                <FormField label="Business name" htmlFor="b-name"><Input id="b-name" className={inputClass} value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} /></FormField>
                <FormField label="Legal name" htmlFor="b-legal"><Input id="b-legal" className={inputClass} value={biz.legalName} onChange={(e) => setBiz({ ...biz, legalName: e.target.value })} /></FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Email" htmlFor="b-email"><Input id="b-email" className={inputClass} value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} /></FormField>
                  <FormField label="Phone" htmlFor="b-phone"><Input id="b-phone" className={inputClass} value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} /></FormField>
                </div>
                <FormField label="Address" htmlFor="b-addr"><Input id="b-addr" className={inputClass} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} /></FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Currency"><Input className={inputClass} value="PHP — Philippine Peso" readOnly /></FormField>
                  <FormField label="Timezone"><Input className={inputClass} value={biz.timezone} readOnly /></FormField>
                </div>
                <div><Button onClick={() => save("Business profile")}>Save changes</Button></div>
              </FormSection>
            )}
            {active === "account" && (
              <FormSection title="Account" description="Your personal details and security.">
                <div className="flex items-center gap-4">
                  <InitialsAvatar name={me.name} size="lg" className="bg-module text-module-foreground" />
                  <Button variant="secondary" size="sm" onClick={() => toast("Avatar upload will be available once storage is connected.")}>Change photo</Button>
                </div>
                <FormField label="Full name" htmlFor="a-name"><Input id="a-name" className={inputClass} value={me.name} onChange={(e) => setMe({ ...me, name: e.target.value })} /></FormField>
                <FormField label="Email" htmlFor="a-email"><Input id="a-email" className={inputClass} value={me.email} onChange={(e) => setMe({ ...me, email: e.target.value })} /></FormField>
                <FormField label="Role"><Input className={inputClass} value="Owner" readOnly /></FormField>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => save("Account")}>Save changes</Button>
                  <Button variant="secondary" onClick={() => toast("Password reset email sent (simulated).")}>Reset password</Button>
                </div>
              </FormSection>
            )}
            {active === "team" && (
              <FormSection title="Team" description="People with access to this workspace.">
                <ul className="divide-y divide-border rounded-xl border border-border">
                  <li className="flex items-center gap-3 px-4 py-3">
                    <InitialsAvatar name={currentUser.name} />
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium">{currentUser.name}</p><p className="truncate text-xs text-muted-foreground">{currentUser.email}</p></div>
                    <StatusBadge status="owner" label="Owner" tone="module" dot={false} />
                  </li>
                  {staff.slice(0, 4).map((s) => (
                    <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                      <InitialsAvatar name={s.name} />
                      <div className="min-w-0 flex-1"><p className="text-sm font-medium">{s.name}</p><p className="truncate text-xs text-muted-foreground">{s.role} · Auto Care</p></div>
                      <StatusBadge status="staff" label={s.role === "Supervisor" ? "Admin" : "Staff"} tone="neutral" dot={false} />
                    </li>
                  ))}
                </ul>
                <div><Button onClick={() => toast.success("Invitation sent", { description: "They'll receive an email to join your workspace." })}><Plus /> Invite member</Button></div>
              </FormSection>
            )}
            {active === "notifications" && (
              <FormSection title="Notifications" description="Choose what you want to hear about.">
                {([
                  ["bookings", "New event bookings"],
                  ["orders", "New and shipped orders"],
                  ["appointments", "Appointment reminders"],
                  ["lowStock", "Low-stock alerts"],
                  ["weekly", "Weekly performance report"],
                  ["sms", "SMS notifications"],
                ] as const).map(([k, label]) => (
                  <label key={k} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <span className="text-sm">{label}</span>
                    <Switch checked={notif[k]} onCheckedChange={(v) => { setNotif({ ...notif, [k]: v }); toast.success(`${label} ${v ? "enabled" : "disabled"}`); }} />
                  </label>
                ))}
              </FormSection>
            )}
            {active === "appearance" && (
              <FormSection title="Appearance" description="Nimbus is designed as a dark interface. Adjust density and accents.">
                <div>
                  <p className="mb-2 text-sm font-medium">Density</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["comfortable", "compact"] as const).map((d) => (
                      <button key={d} type="button" onClick={() => { setDensity(d); toast.success(`Density: ${d}`); }} className={cn("rounded-xl border p-4 text-left text-sm capitalize transition-colors", density === d ? "border-module bg-module-soft" : "border-border-strong hover:bg-accent")}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Module accents</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setAccent("module")} className={cn("rounded-xl border p-4 text-left text-sm transition-colors", accent === "module" ? "border-module bg-module-soft" : "border-border-strong hover:bg-accent")}>
                      <span className="mb-2 flex gap-1"><span className="size-3 rounded-full bg-event" /><span className="size-3 rounded-full bg-commerce" /><span className="size-3 rounded-full bg-autocare" /></span>Per module
                    </button>
                    <button type="button" onClick={() => { setAccent("neutral"); toast("Neutral accents will apply on your next session."); }} className={cn("rounded-xl border p-4 text-left text-sm transition-colors", accent === "neutral" ? "border-module bg-module-soft" : "border-border-strong hover:bg-accent")}>
                      <span className="mb-2 flex gap-1"><span className="size-3 rounded-full bg-foreground" /><span className="size-3 rounded-full bg-muted-foreground" /><span className="size-3 rounded-full bg-border-strong" /></span>Neutral
                    </button>
                  </div>
                </div>
              </FormSection>
            )}
            {active === "billing" && (
              <FormSection title="Billing" description="Subscription billing is a placeholder in this MVP.">
                <div className="rounded-xl border border-module/40 bg-module-soft p-4">
                  <p className="eyebrow text-module">Current plan</p>
                  <p className="mt-1 text-lg font-semibold">Professional · ₱3,192/mo</p>
                  <p className="text-xs text-muted-foreground">Billed annually · Renews Mar 1, 2027</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {plans.map((p) => (
                    <button key={p.id} type="button" onClick={() => toast.success(`Plan change requested: ${p.name}`)} className={cn("rounded-xl border p-4 text-left transition-colors hover:bg-accent", p.id === "professional" ? "border-module" : "border-border-strong")}>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">₱{p.price.toLocaleString()}/mo</p>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => toast("Payment method management will connect to your billing provider.")}>Update payment method</Button>
                  <Button variant="ghost" asChild><Link to="/pricing">Compare plans</Link></Button>
                </div>
              </FormSection>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
