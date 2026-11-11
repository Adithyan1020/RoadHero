import Link from "next/link";
import { EmergencyButton } from "./EmergencyButton";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary tracking-tighter">
            Road<span className="text-destructive">Rescue</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium">
            <Link href="/provider/register" className="hover:text-primary transition-colors">
              Join as Provider
            </Link>
            {email ? (
              <>
                <span className="text-slate-500 max-w-48 truncate" title={email}>
                  {email}
                </span>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="hover:text-primary transition-colors">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="hover:text-primary transition-colors">
                Login
              </Link>
            )}
          </nav>
          <div className="hidden sm:block">
            <EmergencyButton />
          </div>
        </div>
      </div>
    </header>
  );
}
