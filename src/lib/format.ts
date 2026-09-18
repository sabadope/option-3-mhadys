import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

export const TODAY = "2026-09-18";
export const NOW = new Date("2026-09-18T10:15:00");

export function peso(amount: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && Math.abs(amount) >= 1000) {
    const v = amount / 1000;
    return `₱${v.toFixed(v >= 100 ? 0 : 1)}k`;
  }
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string, pattern = "MMM d") {
  return format(parseISO(iso), pattern);
}

export function formatDateLong(iso: string) {
  return format(parseISO(iso), "EEEE, MMMM d, yyyy");
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return format(d, "h:mm a");
}

export function formatDateTime(iso: string) {
  return format(parseISO(iso), "MMM d, h:mm a");
}

export function timeAgo(iso: string) {
  const d = parseISO(iso);
  const diff = NOW.getTime() - d.getTime();
  if (diff < 60_000) return "just now";
  return formatDistanceToNowStrict(d, { addSuffix: true }).replace("in ", "");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join("");
}

export function humanize(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function minutesToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr${h > 1 ? "s" : ""}`;
  return `${h} hr ${m} min`;
}

export function addMinutes(hhmm: string, mins: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

let counter = 500;
export function nextId(prefix: string) {
  counter += 1;
  return `${prefix}_${counter}`;
}
