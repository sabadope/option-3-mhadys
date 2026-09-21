import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brand } from "@/components/shell/Brand";
import { FormField, inputClass } from "@/components/kit/FormField";
import { startSession } from "@/lib/session";
import bg from "@/assets/auth-bg.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nimbus" },
      { name: "description", content: "Sign in to your Nimbus workspace or continue as a demo user to explore the platform." },
      { property: "og:title", content: "Sign in — Nimbus" },
      { property: "og:description", content: "Access your unified events, commerce, and auto care workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    startSession("account", email);
    navigate({ to: "/app" });
  };

  const demo = () => {
    startSession("demo");
    navigate({ to: "/app" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <img src={bg} alt="" width={1920} height={1080} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="glass-strong glass-highlight relative z-10 w-full max-w-[420px] rounded-3xl p-7 sm:p-9"
      >
        <Link to="/" aria-label="Back to home">
          <Brand />
        </Link>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Welcome back.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace.</p>

        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <FormField label="Email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" placeholder="you@company.ph" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Password" htmlFor="password" error={error ?? undefined}>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </FormField>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> Remember me
            </label>
            <button type="button" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" onClick={() => setError("Password reset is available once your account is connected.")}>
              Forgot password?
            </button>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign In <ArrowRight />
              </>
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="glass" size="lg" className="w-full" onClick={demo}>
          <Sparkles /> Continue as Demo
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Demo mode uses realistic sample data. Nothing is sent to a server.</p>
        <Label className="sr-only">Nimbus login</Label>
      </motion.div>
    </div>
  );
}
