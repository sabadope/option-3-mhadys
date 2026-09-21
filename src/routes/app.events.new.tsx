import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { PageHeader, FormField, FormSection, inputClass } from "@/components/kit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import summit from "@/assets/events/summit.jpg";
import workshop from "@/assets/events/workshop.jpg";
import expo from "@/assets/events/expo.jpg";
import type { TicketType } from "@/types";

export const Route = createFileRoute("/app/events/new")({
  head: () => ({
    meta: [
      { title: "New Event — Nimbus" },
      { name: "description", content: "Create a new event with tickets, schedule, and venue details." },
      { property: "og:title", content: "New Event — Nimbus" },
      { property: "og:description", content: "Set up your next event in minutes." },
    ],
  }),
  component: NewEvent,
});

const covers = [
  { id: "summit", src: summit, label: "Summit" },
  { id: "workshop", src: workshop, label: "Workshop" },
  { id: "expo", src: expo, label: "Expo" },
];

interface DraftTicket {
  key: string;
  name: string;
  price: string;
  quantity: string;
}

let ticketKey = 0;

function NewEvent() {
  const { actions } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(covers[0]!.src);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [category, setCategory] = useState("Conference");
  const [tickets, setTickets] = useState<DraftTicket[]>([{ key: String(ticketKey++), name: "General Admission", price: "", quantity: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTicketRow = () => setTickets((t) => [...t, { key: String(ticketKey++), name: "", price: "", quantity: "" }]);
  const removeTicketRow = (key: string) => setTickets((t) => t.filter((r) => r.key !== key));
  const updateTicketRow = (key: string, field: keyof DraftTicket, value: string) =>
    setTickets((t) => t.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Event name is required.";
    if (!description.trim()) errs.description = "Add a short description.";
    if (!date) errs.date = "Pick a date.";
    if (!startTime) errs.startTime = "Set a start time.";
    if (!endTime) errs.endTime = "Set an end time.";
    if (!venue.trim()) errs.venue = "Venue is required.";
    if (!address.trim()) errs.address = "Address is required.";
    if (!capacity || Number(capacity) <= 0) errs.capacity = "Enter a capacity greater than 0.";
    if (tickets.length === 0) errs.tickets = "Add at least one ticket type.";
    tickets.forEach((t) => {
      if (!t.name.trim() || !t.price || !t.quantity) errs.tickets = "Fill out all ticket type fields.";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (status: "draft" | "published") => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const ticketTypes: TicketType[] = tickets.map((t, i) => ({
      id: `tt_new_${i}_${Date.now()}`,
      eventId: "pending",
      name: t.name,
      description: "",
      price: Number(t.price),
      quantity: Number(t.quantity),
      sold: 0,
    }));
    const created = actions.addEvent({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      coverImage: cover,
      category,
      date,
      startTime,
      endTime,
      venue,
      address,
      capacity: Number(capacity),
      status,
      ticketTypes,
    });
    // fix ticketTypes eventId reference now that we have the id
    actions.updateEvent(created.id, { ticketTypes: ticketTypes.map((t) => ({ ...t, eventId: created.id })) });
    toast.success(status === "published" ? "Event published." : "Draft saved.");
    navigate({ to: "/app/events/$eventId", params: { eventId: created.id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Events" title="New event" description="Set up the details, schedule, and tickets." />

      <FormSection title="Basics" description="Name, description, and cover image.">
        <FormField label="Event name" htmlFor="name" required error={errors.name}>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tech & Innovation Summit" className={inputClass} />
        </FormField>
        <FormField label="Description" htmlFor="description" required error={errors.description}>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this event about?" className="min-h-24 rounded-xl border-border-strong bg-surface-2" />
        </FormField>
        <FormField label="Cover image" required>
          <div className="grid grid-cols-3 gap-3">
            {covers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCover(c.src)}
                className={cn("relative overflow-hidden rounded-xl border-2", cover === c.src ? "border-module" : "border-transparent")}
              >
                <img src={c.src} alt={c.label} className="h-20 w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{c.label}</span>
              </button>
            ))}
          </div>
        </FormField>
        <FormField label="Category" htmlFor="category">
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "w-full bg-surface-2")}>
            {["Conference", "Workshop", "Festival", "Networking", "Concert"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </FormSection>

      <FormSection title="Schedule & venue">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Date" htmlFor="date" required error={errors.date}>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Start time" htmlFor="start" required error={errors.startTime}>
            <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="End time" htmlFor="end" required error={errors.endTime}>
            <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
          </FormField>
        </div>
        <FormField label="Venue" htmlFor="venue" required error={errors.venue}>
          <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="SMX Convention Center" className={inputClass} />
        </FormField>
        <FormField label="Address" htmlFor="address" required error={errors.address}>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mall of Asia Complex, Pasay" className={inputClass} />
        </FormField>
        <FormField label="Capacity" htmlFor="capacity" required error={errors.capacity}>
          <Input id="capacity" type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="500" className={inputClass} />
        </FormField>
      </FormSection>

      <FormSection title="Ticket types" description="Add one or more ticket tiers.">
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.key} className="grid grid-cols-1 gap-2 rounded-xl border border-border-strong p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
              <FormField label="Name" htmlFor={`tn-${t.key}`}>
                <Input id={`tn-${t.key}`} value={t.name} onChange={(e) => updateTicketRow(t.key, "name", e.target.value)} placeholder="VIP" className={inputClass} />
              </FormField>
              <FormField label="Price (₱)" htmlFor={`tp-${t.key}`}>
                <Input id={`tp-${t.key}`} type="number" min={0} value={t.price} onChange={(e) => updateTicketRow(t.key, "price", e.target.value)} placeholder="1500" className={inputClass} />
              </FormField>
              <FormField label="Quantity" htmlFor={`tq-${t.key}`}>
                <Input id={`tq-${t.key}`} type="number" min={1} value={t.quantity} onChange={(e) => updateTicketRow(t.key, "quantity", e.target.value)} placeholder="100" className={inputClass} />
              </FormField>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove ticket type" onClick={() => removeTicketRow(t.key)} disabled={tickets.length === 1}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {errors.tickets && <p className="text-xs text-destructive">{errors.tickets}</p>}
          <Button type="button" variant="secondary" onClick={addTicketRow}>
            <Plus className="size-4" /> Add ticket type
          </Button>
        </div>
      </FormSection>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" size="lg" onClick={() => submit("draft")}>
          Save Draft
        </Button>
        <Button type="button" variant="module" size="lg" onClick={() => submit("published")}>
          Publish Event
        </Button>
      </div>
    </div>
  );
}
