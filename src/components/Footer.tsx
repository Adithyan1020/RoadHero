import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:grid-cols-[1.6fr_1fr_1fr] md:px-6">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-sm text-white/70">
            Roadside help from verified local mechanics and tow operators, any time of day.
          </p>
        </div>
        <div className="space-y-4">
          <p className="font-semibold text-lime">Drivers</p>
          <ul className="space-y-2.5 text-white/80">
            <li><Link href="/emergency" className="hover:text-white hover:underline">Request help</Link></li>
            <li><Link href="/stations" className="hover:text-white hover:underline">Fuel &amp; charging nearby</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white hover:underline">How it works</Link></li>
            <li><Link href="/login" className="hover:text-white hover:underline">Log in</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="font-semibold text-lime">Providers</p>
          <ul className="space-y-2.5 text-white/80">
            <li><Link href="/provider/register" className="hover:text-white hover:underline">Join as a provider</Link></li>
            <li><Link href="/provider/dashboard" className="hover:text-white hover:underline">Provider dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-4 py-6 text-sm text-white/50 md:px-6">
          © {new Date().getFullYear()} RoadRescue
        </div>
      </div>
    </footer>
  );
}
