import type { Attendee, Booking, Event } from "@/types";
import summit from "@/assets/events/summit.jpg";
import workshop from "@/assets/events/workshop.jpg";
import expo from "@/assets/events/expo.jpg";

export const events: Event[] = [
  {
    id: "ev_1",
    name: "Tech & Innovation Summit",
    slug: "tech-innovation-summit",
    description:
      "A full-day summit bringing together founders, engineers, and product leaders across Southeast Asia. Keynotes, panels, and a hands-on builders track.",
    coverImage: summit,
    category: "Conference",
    date: "2026-09-28",
    startTime: "09:00",
    endTime: "17:00",
    venue: "SMX Convention Center",
    address: "Seashell Ln, Mall of Asia Complex, Pasay",
    capacity: 500,
    status: "published",
    ticketTypes: [
      { id: "tt_1", eventId: "ev_1", name: "General Admission", description: "Access to all keynotes and panels", price: 1500, quantity: 350, sold: 268 },
      { id: "tt_2", eventId: "ev_1", name: "VIP", description: "Front-row seating, lounge access, lunch included", price: 4500, quantity: 100, sold: 62 },
      { id: "tt_3", eventId: "ev_1", name: "Student", description: "Valid student ID required at check-in", price: 750, quantity: 50, sold: 12 },
    ],
  },
  {
    id: "ev_2",
    name: "Creative Business Workshop",
    slug: "creative-business-workshop",
    description:
      "An intimate half-day workshop for creative entrepreneurs on pricing, positioning, and building a sustainable studio practice.",
    coverImage: workshop,
    category: "Workshop",
    date: "2026-09-18",
    startTime: "13:00",
    endTime: "17:30",
    venue: "The Loft at Poblacion",
    address: "5648 Don Pedro St, Poblacion, Makati",
    capacity: 60,
    status: "published",
    ticketTypes: [
      { id: "tt_4", eventId: "ev_2", name: "Workshop Seat", description: "Includes workbook and coffee", price: 2200, quantity: 60, sold: 54 },
    ],
  },
  {
    id: "ev_3",
    name: "Community Expo",
    slug: "community-expo",
    description:
      "Two evenings of local makers, food stalls, and live music. Free entry for kids under 12.",
    coverImage: expo,
    category: "Festival",
    date: "2026-10-11",
    startTime: "16:00",
    endTime: "22:00",
    venue: "Bonifacio High Street Amphitheater",
    address: "Bonifacio Global City, Taguig",
    capacity: 1200,
    status: "published",
    ticketTypes: [
      { id: "tt_5", eventId: "ev_3", name: "Day Pass", description: "Single evening entry", price: 350, quantity: 1000, sold: 412 },
      { id: "tt_6", eventId: "ev_3", name: "Weekend Pass", description: "Both evenings + tote bag", price: 600, quantity: 200, sold: 88 },
    ],
  },
  {
    id: "ev_4",
    name: "Founders Dinner Series: Vol. 4",
    slug: "founders-dinner-vol-4",
    description: "A curated dinner for 24 founders. Invitation and application based.",
    coverImage: workshop,
    category: "Networking",
    date: "2026-11-06",
    startTime: "18:30",
    endTime: "21:30",
    venue: "Toyo Eatery",
    address: "The Alley at Karrivin, Makati",
    capacity: 24,
    status: "draft",
    ticketTypes: [
      { id: "tt_7", eventId: "ev_4", name: "Seat", description: "Five-course dinner", price: 5800, quantity: 24, sold: 0 },
    ],
  },
];

export const bookings: Booking[] = [
  { id: "bk_1", code: "BK-20481", customerId: "c_1", eventId: "ev_1", ticketTypeId: "tt_2", quantity: 1, amount: 4500, status: "confirmed", createdAt: "2026-09-10T09:12:00", paymentMethod: "card" },
  { id: "bk_2", code: "BK-20482", customerId: "c_2", eventId: "ev_1", ticketTypeId: "tt_1", quantity: 2, amount: 3000, status: "confirmed", createdAt: "2026-09-10T11:40:00", paymentMethod: "online" },
  { id: "bk_3", code: "BK-20483", customerId: "c_3", eventId: "ev_2", ticketTypeId: "tt_4", quantity: 1, amount: 2200, status: "checked_in", createdAt: "2026-09-11T14:05:00", paymentMethod: "online" },
  { id: "bk_4", code: "BK-20484", customerId: "c_7", eventId: "ev_2", ticketTypeId: "tt_4", quantity: 1, amount: 2200, status: "checked_in", createdAt: "2026-09-12T08:30:00", paymentMethod: "card" },
  { id: "bk_5", code: "BK-20485", customerId: "c_9", eventId: "ev_2", ticketTypeId: "tt_4", quantity: 2, amount: 4400, status: "confirmed", createdAt: "2026-09-13T16:22:00", paymentMethod: "cash" },
  { id: "bk_6", code: "BK-20486", customerId: "c_5", eventId: "ev_3", ticketTypeId: "tt_6", quantity: 2, amount: 1200, status: "pending", createdAt: "2026-09-15T10:11:00", paymentMethod: "online" },
  { id: "bk_7", code: "BK-20487", customerId: "c_8", eventId: "ev_3", ticketTypeId: "tt_5", quantity: 4, amount: 1400, status: "confirmed", createdAt: "2026-09-16T12:45:00", paymentMethod: "card" },
  { id: "bk_8", code: "BK-20488", customerId: "c_4", eventId: "ev_1", ticketTypeId: "tt_1", quantity: 1, amount: 1500, status: "cancelled", createdAt: "2026-09-16T18:02:00", paymentMethod: "online" },
  { id: "bk_9", code: "BK-20489", customerId: "c_6", eventId: "ev_1", ticketTypeId: "tt_2", quantity: 2, amount: 9000, status: "confirmed", createdAt: "2026-09-17T09:50:00", paymentMethod: "card" },
  { id: "bk_10", code: "BK-20490", customerId: "c_10", eventId: "ev_1", ticketTypeId: "tt_3", quantity: 1, amount: 750, status: "pending", createdAt: "2026-09-18T07:15:00", paymentMethod: "online" },
];

export const attendees: Attendee[] = [
  { id: "at_1", bookingId: "bk_1", eventId: "ev_1", ticketTypeId: "tt_2", name: "John Smith", email: "john.smith@gmail.com", qrCode: "NMB-EV1-A7K2Q", checkedIn: false },
  { id: "at_2", bookingId: "bk_2", eventId: "ev_1", ticketTypeId: "tt_1", name: "Maria Santos", email: "maria.santos@outlook.com", qrCode: "NMB-EV1-B3M9X", checkedIn: false },
  { id: "at_3", bookingId: "bk_2", eventId: "ev_1", ticketTypeId: "tt_1", name: "Luis Santos", email: "luis.santos@gmail.com", qrCode: "NMB-EV1-C8P1L", checkedIn: false },
  { id: "at_4", bookingId: "bk_3", eventId: "ev_2", ticketTypeId: "tt_4", name: "Alex Rivera", email: "alex.rivera@proton.me", qrCode: "NMB-EV2-D4R6T", checkedIn: true, checkedInAt: "2026-09-18T12:48:00" },
  { id: "at_5", bookingId: "bk_4", eventId: "ev_2", ticketTypeId: "tt_4", name: "Isabel Garcia", email: "isabel.garcia@gmail.com", qrCode: "NMB-EV2-E2W8N", checkedIn: true, checkedInAt: "2026-09-18T12:52:00" },
  { id: "at_6", bookingId: "bk_5", eventId: "ev_2", ticketTypeId: "tt_4", name: "Andrea Lim", email: "andrea.lim@outlook.com", qrCode: "NMB-EV2-F9H3V", checkedIn: false },
  { id: "at_7", bookingId: "bk_5", eventId: "ev_2", ticketTypeId: "tt_4", name: "Nathan Lim", email: "nathan.lim@gmail.com", qrCode: "NMB-EV2-G5J7B", checkedIn: false },
  { id: "at_8", bookingId: "bk_7", eventId: "ev_3", ticketTypeId: "tt_5", name: "Miguel Villanueva", email: "miguel.v@gmail.com", qrCode: "NMB-EV3-H1K4Z", checkedIn: false },
  { id: "at_9", bookingId: "bk_9", eventId: "ev_1", ticketTypeId: "tt_2", name: "Rafael Tan", email: "rafael.tan@icloud.com", qrCode: "NMB-EV1-J6L2S", checkedIn: false },
  { id: "at_10", bookingId: "bk_9", eventId: "ev_1", ticketTypeId: "tt_2", name: "Grace Tan", email: "grace.tan@icloud.com", qrCode: "NMB-EV1-K3N8D", checkedIn: false },
];

/** Daily ticket sales for the last 14 days (for charts). */
export const ticketSalesSeries = [
  { day: "Sep 5", tickets: 18, revenue: 31500 },
  { day: "Sep 6", tickets: 24, revenue: 42800 },
  { day: "Sep 7", tickets: 15, revenue: 22400 },
  { day: "Sep 8", tickets: 31, revenue: 58200 },
  { day: "Sep 9", tickets: 27, revenue: 47100 },
  { day: "Sep 10", tickets: 42, revenue: 89600 },
  { day: "Sep 11", tickets: 38, revenue: 72300 },
  { day: "Sep 12", tickets: 29, revenue: 51800 },
  { day: "Sep 13", tickets: 44, revenue: 96400 },
  { day: "Sep 14", tickets: 36, revenue: 68900 },
  { day: "Sep 15", tickets: 51, revenue: 112500 },
  { day: "Sep 16", tickets: 47, revenue: 98200 },
  { day: "Sep 17", tickets: 58, revenue: 134800 },
  { day: "Sep 18", tickets: 33, revenue: 61200 },
];
