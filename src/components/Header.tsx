import Link from "next/link";
import { EmergencyButton } from "./EmergencyButton";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  return (
    <header className="sticky top-0 z-50 w-full bg-paper shadow-[0_1px_0_0_#e8ebe6]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-forest md:flex">
            <Link href="/#how-it-works" className="hover:underline hover:underline-offset-4">
              How it works
            </Link>
            <Link href="/stations" className="hover:underline hover:underline-offset-4">
              Fuel &amp; charging
            </Link>
            <Link href="/provider/register" className="hover:underline hover:underline-offset-4">
              For mechanics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {email ? (
            <>
              <span className="hidden max-w-44 truncate text-sm text-muted-foreground lg:inline" title={email}>
                {email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="h-10 rounded-full border border-forest px-4 text-sm font-medium text-forest transition-colors hover:bg-mist"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-full border border-forest px-4 text-sm font-medium text-forest transition-colors hover:bg-mist"
            >
              Log in
            </Link>
          )}

          <EmergencyButton className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
