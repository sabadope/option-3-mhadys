import type { Appointment, Bay, Service, ServiceAddOn, StaffMember, Vehicle, WorkOrder } from "@/types";
import { addOns, services as allServices } from "@/data/autocare";
import { addMinutes } from "@/lib/format";

/** Vehicle paint swatch colors — inline hex is acceptable only for this. */
export const paintColors: Record<string, string> = {
  White: "#eef0f2",
  Black: "#1c1d20",
  "Shadow Black": "#1a1b1e",
  Silver: "#c6cad0",
  Gray: "#6b6f76",
  "Sonic Gray": "#63666d",
  Graphite: "#3d4045",
  Red: "#a3222c",
  "Soul Red": "#8f1d24",
  Blue: "#2c4a7c",
  Green: "#2f5d45",
  Yellow: "#e6c229",
  "Kinetic Yellow": "#e2c11f",
  Orange: "#c76a2a",
  White_pearl: "#f2f1ea",
};

export function paintColor(name: string) {
  return paintColors[name] ?? "#8a8f98";
}

export function serviceById(id: string): Service | undefined {
  return allServices.find((s) => s.id === id);
}

export function addOnById(id: string): ServiceAddOn | undefined {
  return addOns.find((a) => a.id === id);
}

export function addOnsTotal(ids: string[]) {
  return ids.reduce((sum, id) => sum + (addOnById(id)?.price ?? 0), 0);
}

export function addOnsDuration(ids: string[]) {
  return ids.reduce((sum, id) => sum + (addOnById(id)?.durationMinutes ?? 0), 0);
}

export function appointmentEnd(a: Pick<Appointment, "time" | "durationMinutes">) {
  return addMinutes(a.time, a.durationMinutes);
}

/** True when two [start,end) time ranges (HH:mm) overlap. */
export function timeOverlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

export function checklistProgress(wo: Pick<WorkOrder, "checklist">) {
  if (wo.checklist.length === 0) return 0;
  return wo.checklist.filter((c) => c.done).length / wo.checklist.length;
}

export function staffSkillMatch(staff: StaffMember, bayType: Service["bayType"]) {
  return staff.skills.includes(bayType);
}

export function bayAvailableForType(bay: Bay, bayType: Service["bayType"]) {
  return bay.type === bayType && bay.status !== "maintenance";
}

export const WO_STEPS: { key: WorkOrder["status"]; label: string }[] = [
  { key: "booked", label: "Booked" },
  { key: "confirmed", label: "Confirmed" },
  { key: "arrived", label: "Vehicle Arrived" },
  { key: "in_queue", label: "In Queue" },
  { key: "in_progress", label: "In Progress" },
  { key: "quality_check", label: "Quality Check" },
  { key: "completed", label: "Completed" },
];
