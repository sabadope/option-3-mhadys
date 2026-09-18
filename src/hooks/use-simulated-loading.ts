import { useEffect, useState } from "react";

/**
 * Simulates a network round-trip so pages can show their skeleton state.
 * Replace with real query loading flags when a backend is connected.
 */
export function useSimulatedLoading(ms = 450) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

/** Runs an async-looking action with a pending flag, for button feedback. */
export function useAsyncAction(ms = 700) {
  const [pending, setPending] = useState(false);
  const run = async (fn: () => void) => {
    setPending(true);
    await new Promise((r) => setTimeout(r, ms));
    fn();
    setPending(false);
  };
  return { pending, run };
}
