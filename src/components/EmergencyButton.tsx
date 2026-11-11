import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

type Props = {
  size?: "sm" | "lg";
  className?: string;
};

// Primary CTA: lime pill, forest text, no shadow (the fill does the work).
// Rendered as a styled link, not a <button> inside an <a>, which is invalid HTML.
export function EmergencyButton({ size = "sm", className }: Props) {
  const isLarge = size === "lg";
  return (
    <Link
      href="/emergency"
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full bg-lime font-semibold text-forest transition-colors hover:bg-[#8fd95f]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
        isLarge ? "h-14 px-8 text-lg" : "h-10 px-5 text-sm",
        className
      )}
    >
      Get help now
      <ArrowRight className={cn("transition-transform group-hover:translate-x-0.5", isLarge ? "size-5" : "size-4")} />
    </Link>
  );
}
