import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function EmergencyButton() {
  return (
    <Link href="/emergency" className="block">
      <Button 
        variant="destructive" 
        size="lg" 
        className="w-full sm:w-auto font-bold text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none flex items-center gap-2"
      >
        <AlertTriangle className="w-6 h-6" />
        GET HELP NOW
      </Button>
    </Link>
  );
}
