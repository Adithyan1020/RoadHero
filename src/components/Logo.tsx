import Link from "next/link";
import { cn } from "cn";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full",
          inverted ? "bg-lime text-forest" : "bg-forest text-lime"
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className={cn("text-xl font-black tracking-[-0.04em]", inverted ? "text-white" : "text-forest")}>
        roadrescue
      </span>
    </Link>
  );
}
