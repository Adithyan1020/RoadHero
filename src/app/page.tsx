import { EmergencyButton } from "@/components/EmergencyButton";
import { ShieldCheck, MapPin, Clock, Wrench, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-950 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-slate-950/90 z-0" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Badge className="mb-6 bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20">
            24/7 Emergency Assistance
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 max-w-4xl">
            Stuck on the road? <br className="hidden md:block"/>
            <span className="text-red-500">Help is one tap away.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl">
            Connect instantly with verified nearby workshops. Whether it's a flat tire, dead battery, or towing needs, RoadRescue gets you moving again safely and quickly.
          </p>
          
          <div className="w-full max-w-md mx-auto p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 mb-12 shadow-2xl">
            <p className="text-sm text-slate-300 mb-4 font-medium">PRESS FOR IMMEDIATE HELP</p>
            <EmergencyButton />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-4 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Verified Providers
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Live Tracking
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Fast Arrival
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How RoadRescue Works</h2>
            <p className="text-slate-600 text-lg">Stress-free roadside assistance in three simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Tap for Help</h3>
              <p className="text-slate-600">Hit the emergency button. We automatically detect your location and ask what's wrong.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Get Matched</h3>
              <p className="text-slate-600">We instantly notify verified nearby workshops. See their ETA and track them on the map.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-6 shadow-sm">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Back on the Road</h3>
              <p className="text-slate-600">A professional arrives to fix your issue. Review their service and pay securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA Section */}
      <section className="py-24 bg-white border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Are you a tow truck operator or mechanic?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl">
              Grow your business with RoadRescue. Connect with drivers in need nearby, manage your availability, and earn more. Sign up today and get verified.
            </p>
            <Link href="/provider/register">
              <Button size="lg" className="rounded-full gap-2">
                Join as a Service Provider
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 bg-slate-100 rounded-3xl p-8 aspect-video flex items-center justify-center border shadow-inner">
            <p className="text-slate-400 font-medium">[Provider Dashboard Illustration]</p>
          </div>
        </div>
      </section>
    </div>
  );
}
