const KEY = "nimbus.session";

export interface Session {
  mode: "demo" | "account";
  email: string;
  startedAt: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function startSession(mode: Session["mode"], email = "demo@nimbus.ph") {
  const s: Session = { mode, email, startedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

export function endSession() {
  window.localStorage.removeItem(KEY);
}
