"use client";

import { useState, useEffect } from "react";
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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          // Default to a generic location if failed
          setLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemType: selectedProblem,
          location,
          // user details will be added with Clerk later
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container max-w-lg mx-auto p-4 py-20 flex flex-col items-center text-center">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Request Sent!</h1>
        <p className="text-slate-600 mb-8">
          We have found available workshops nearby. They have been notified via WhatsApp.
        </p>
        <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border mb-8 relative">
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
      <Card className="border-red-100 shadow-xl">
        <CardHeader className="bg-red-50/50 border-b border-red-100 pb-8 text-center rounded-t-xl">
          <CardTitle className="text-3xl font-black text-red-600">Emergency Request</CardTitle>
          <CardDescription className="text-lg">Get help right now. We'll send someone your way.</CardDescription>
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
              <p className="text-sm text-slate-500">Drag the pin to adjust your exact breakdown location.</p>
              
              <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border">
                <MapWrapper 
                  location={location} 
                  onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-bold">What's the problem?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problemTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedProblem === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedProblem(type.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? "border-red-500 bg-red-50 text-red-700" 
                          : "border-slate-200 hover:border-red-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${isSelected ? "text-red-500" : "text-slate-500"}`} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-bold">Additional details (Optional)</Label>
              <Textarea placeholder="Describe the issue or any specific tools they might need..." className="resize-none" />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={!selectedProblem || !location || isSubmitting}
              className="w-full text-lg h-16 font-bold bg-red-600 hover:bg-red-700 shadow-lg text-white"
            >
              {isSubmitting ? "FINDING HELP..." : "REQUEST HELP NOW"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
