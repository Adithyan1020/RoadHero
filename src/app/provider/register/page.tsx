"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Upload, CheckCircle2 } from "lucide-react";

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (step === 3) {
    return (
      <div className="container max-w-lg mx-auto p-4 py-20 flex flex-col items-center text-center">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
        <p className="text-slate-600 mb-8">
          Thank you for applying to join RoadRescue. Our team will review your documents and verify your account within 24-48 hours.
        </p>
        <Button className="w-full" size="lg" onClick={() => window.location.href = "/provider/dashboard"}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Join RoadRescue</h1>
        <p className="text-slate-600 text-lg">Partner with us and get access to thousands of drivers in need.</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-12">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-400"}`}>1</div>
        <div className={`h-1 w-16 rounded ${step >= 2 ? "bg-primary" : "bg-slate-100"}`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-400"}`}>2</div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl">{step === 1 ? "Business Details" : "Verification Documents"}</CardTitle>
          <CardDescription>
            {step === 1 ? "Tell us about your workshop or towing service." : "Upload necessary documents for verification."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="e.g. Mike's Auto Repair" />
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Textarea placeholder="Full address of your primary location" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Radius (km)</Label>
                  <Input type="number" placeholder="e.g. 50" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Services Offered (comma separated)</Label>
                <Input placeholder="Towing, Battery Jump, Flat Tire" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl flex items-start gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>We require a valid business license and insurance proof to ensure trust and safety on our platform.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business License</Label>
                  <Button variant="outline" className="w-full h-20 border-dashed justify-start px-6">
                    <Upload className="w-5 h-5 mr-4 text-slate-400" />
                    <div className="text-left">
                      <p className="font-medium">Upload License</p>
                      <p className="text-xs text-slate-500">PDF, JPG or PNG (max 5MB)</p>
                    </div>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Insurance Proof</Label>
                  <Button variant="outline" className="w-full h-20 border-dashed justify-start px-6">
                    <Upload className="w-5 h-5 mr-4 text-slate-400" />
                    <div className="text-left">
                      <p className="font-medium">Upload Insurance</p>
                      <p className="text-xs text-slate-500">PDF, JPG or PNG (max 5MB)</p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 mt-6 border-t">
            {step > 1 && (
              <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                Back
              </Button>
            )}
            <Button type="button" className="flex-1" onClick={nextStep}>
              {step === 2 ? "Submit Application" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
