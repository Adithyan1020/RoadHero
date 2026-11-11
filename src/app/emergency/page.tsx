"use client";

import { useState } from "react";
import { useGeolocation, formatDistance } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Battery, Wrench, Navigation, Car, AlertCircle, Camera, CheckCircle2 } from "lucide-react";
import { MapWrapper } from "@/components/MapWrapper";

const problemTypes = [
  { id: "battery", label: "Dead Battery", icon: Battery },
  { id: "puncture", label: "Flat Tire", icon: AlertCircle },
  { id: "towing", label: "Towing", icon: Car },
  { id: "engine", label: "Engine Issue", icon: Wrench },
  { id: "lockout", label: "Lockout", icon: AlertCircle },
  { id: "fuel", label: "Out of Fuel", icon: AlertCircle },
  { id: "other", label: "Other", icon: AlertCircle },
];

export default function EmergencyPage() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    location,
    accuracy,
    error: locationError,
    isLocating,
    locate: handleGetLocation,
    setManualLocation,
  } = useGeolocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemType: selectedProblem,
          location,
          description,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else if (res.status === 401) {
        window.location.href = "/login?next=/emergency";
      } else {
        const data = await res.json().catch(() => null);
        setSubmitError(data?.message ?? "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container max-w-lg mx-auto p-4 py-20 flex flex-col items-center text-center">
        <CheckCircle2 className="w-24 h-24 text-forest mb-6" />
        <h1 className="text-3xl font-bold mb-4">Request Sent!</h1>
        <p className="text-muted-foreground mb-8">
          We have found available workshops nearby. They have been notified by email.
        </p>
        <div className="w-full h-64 bg-fog rounded-[10px] overflow-hidden border mb-8 relative">
          <MapWrapper location={location} readOnly />
        </div>
        <Button className="w-full" size="lg" variant="outline" onClick={() => window.location.href = "/"}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 py-8">
      <Card className="rounded-[28px] border-0 shadow-hairline">
        <CardHeader className="bg-forest pt-8 pb-8 text-center">
          <CardTitle className="display text-5xl text-lime uppercase">Emergency request</CardTitle>
          <CardDescription className="text-lg">Get help right now. We&apos;ll send someone your way.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Your Location</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isLocating ? "Locating..." : "Locate Me"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {location
                  ? "Drag the pin, or tap the map, to mark exactly where you are."
                  : "Tap the map to drop a pin where you are."}
              </p>
              {locationError && (
                <p className="rounded-[10px] bg-alarm/10 p-3 text-sm text-alarm">{locationError}</p>
              )}
              {!locationError && accuracy !== null && accuracy > 300 && (
                <p className="rounded-[10px] bg-mist p-3 text-sm text-forest">
                  This is only a rough guess. Your device says it could be up to{" "}
                  <strong>{formatDistance(accuracy)}</strong> off (computers without GPS guess from Wi-Fi).
                  Please drag the pin or tap the map to where you actually are.
                </p>
              )}

              <div className="w-full h-72 bg-fog rounded-[10px] overflow-hidden border">
                <MapWrapper
                  location={location}
                  accuracy={accuracy}
                  onLocationSelect={setManualLocation}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-bold">What&apos;s the problem?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problemTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedProblem === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedProblem(type.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[10px] border-2 transition-all ${
                        isSelected 
                          ? "border-forest bg-mist text-forest" 
                          : "border-fog hover:border-forest/40 hover:bg-mist/50"
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${isSelected ? "text-forest" : "text-charcoal"}`} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-bold">Additional details (Optional)</Label>
              <Textarea
                placeholder="Describe the issue or any specific tools they might need..."
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            </div>

            {submitError && <p className="rounded-[10px] bg-alarm/10 p-3 text-sm text-alarm">{submitError}</p>}

            <Button 
              type="submit" 
              size="lg" 
              disabled={!selectedProblem || !location || isSubmitting}
              className="h-16 w-full text-lg font-semibold"
            >
              {isSubmitting ? "FINDING HELP..." : "REQUEST HELP NOW"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
