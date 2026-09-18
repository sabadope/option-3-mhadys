import type { Business, Customer, User } from "@/types";

export const currentUser: User = {
  id: "u_1",
  name: "Sabado Reyes",
  email: "sabado@nimbus.ph",
  role: "owner",
  avatarInitials: "SR",
};

export const business: Business = {
  id: "b_1",
  name: "Nimbus Studio Manila",
  legalName: "Nimbus Studio Manila Inc.",
  email: "hello@nimbusstudio.ph",
  phone: "+63 917 555 0140",
  address: "18 Bonifacio High Street, Taguig, Metro Manila",
  currency: "PHP",
  timezone: "Asia/Manila",
  plan: "professional",
};

export const customers: Customer[] = [
  { id: "c_1", name: "John Smith", email: "john.smith@gmail.com", phone: "+63 917 220 4410", city: "Makati", joinedAt: "2025-02-14", tags: ["VIP", "Auto Care"] },
  { id: "c_2", name: "Maria Santos", email: "maria.santos@outlook.com", phone: "+63 918 331 7782", city: "Quezon City", joinedAt: "2025-03-02", tags: ["Events"] },
  { id: "c_3", name: "Alex Rivera", email: "alex.rivera@proton.me", phone: "+63 915 442 9910", city: "Taguig", joinedAt: "2025-04-19", tags: ["Merch", "Events"] },
  { id: "c_4", name: "Paolo Dela Cruz", email: "paolo.dc@yahoo.com", phone: "+63 920 118 6603", city: "Pasig", joinedAt: "2025-05-08", tags: ["Auto Care"] },
  { id: "c_5", name: "Camille Bautista", email: "camille.b@gmail.com", phone: "+63 916 772 3355", city: "Mandaluyong", joinedAt: "2025-06-21", tags: ["Merch"] },
  { id: "c_6", name: "Rafael Tan", email: "rafael.tan@icloud.com", phone: "+63 917 900 1287", city: "Parañaque", joinedAt: "2025-07-03", tags: ["Auto Care", "VIP"] },
  { id: "c_7", name: "Isabel Garcia", email: "isabel.garcia@gmail.com", phone: "+63 919 554 2231", city: "Makati", joinedAt: "2025-07-27", tags: ["Events"] },
  { id: "c_8", name: "Miguel Villanueva", email: "miguel.v@gmail.com", phone: "+63 918 003 4491", city: "Muntinlupa", joinedAt: "2025-08-11", tags: ["Merch"] },
  { id: "c_9", name: "Andrea Lim", email: "andrea.lim@outlook.com", phone: "+63 917 665 1120", city: "San Juan", joinedAt: "2025-08-30", tags: ["Events", "Merch"] },
  { id: "c_10", name: "Carlo Mendoza", email: "carlo.mendoza@gmail.com", phone: "+63 915 231 8874", city: "Las Piñas", joinedAt: "2025-09-05", tags: ["Auto Care"] },
];
