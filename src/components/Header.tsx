import Link from "next/link";
import { EmergencyButton } from "./EmergencyButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary tracking-tighter">
            Road<span className="text-destructive">Rescue</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 mr-4 text-sm font-medium">
            <Link href="/provider/register" className="hover:text-primary transition-colors">
              Join as Provider
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors">
              Login
            </Link>
          </nav>
          <div className="hidden sm:block">
            <EmergencyButton />
          </div>
        </div>
      </div>
    </header>
  );
}
