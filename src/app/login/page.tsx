"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailCheck } from "lucide-react";

function safeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? `Sign-in didn't go through: ${searchParams.get("error")}` : null
  );
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  // Google sign-in works for both new and existing accounts.
  // Supabase sends the user to Google, then back to /auth/callback.
  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success the browser leaves this page, so there's nothing else to do here.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is turned off in Supabase, the user is signed in right away
    if (data.session) {
      router.push(next);
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  };

  if (checkEmail) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-mist text-forest">
          <MailCheck className="size-9" strokeWidth={1.75} />
        </span>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Check your email</h1>
        <p className="mt-4 text-lg text-charcoal">
          We sent a confirmation link to <strong className="text-obsidian">{email}</strong>. Click it to finish creating your account.
        </p>
      </div>
    );
  }

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1200px] items-center gap-12 px-4 py-12 md:px-6 lg:grid-cols-2">
      {/* Dark section card */}
      <div className="hidden h-full max-h-[620px] flex-col justify-between rounded-[28px] bg-forest p-12 text-white lg:flex">
        <h2 className="display text-[4rem] text-lime uppercase">
          Help from
          <br />
          people
          <br />
          nearby.
        </h2>
        <p className="max-w-sm text-lg leading-relaxed text-white/85">
          Every workshop is checked before it can take jobs, and your location only goes to the one
          that accepts your request.
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-4xl font-bold tracking-tight">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-3 text-lg text-charcoal">
          {isSignup ? "Request help or join as a provider." : "Log in to your RoadRescue account."}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-forest bg-paper font-medium text-forest transition-colors hover:bg-mist disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-fog" />
            or use email
            <span className="h-px flex-1 bg-fog" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="rounded-[10px] bg-alarm/10 p-3 text-sm text-alarm">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New to RoadRescue?"}{" "}
            <button
              type="button"
              className="font-semibold text-forest underline underline-offset-4 hover:no-underline"
              onClick={() => {
                setMode(isSignup ? "signin" : "signup");
                setError(null);
              }}
            >
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
