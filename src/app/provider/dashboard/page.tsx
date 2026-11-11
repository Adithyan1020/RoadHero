"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Clock, Battery, AlertCircle, Check, X, Phone } from "lucide-react";

export default function ProviderDashboardPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any>(null);

  const pendingRequests = [
    {
      id: "REQ-1234",
      user: "Alex Johnson",
      phone: "+1 555-0123",
      problem: "Dead Battery",
      distance: "2.5 km away",
      time: "5 mins ago",
      icon: Battery
    }
  ];

  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your requests and availability</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-[10px] border shadow-sm">
          <div className="flex flex-col">
            <Label htmlFor="online-mode" className="font-bold text-base">
              {isOnline ? "You are Online" : "You are Offline"}
            </Label>
            <span className="text-sm text-muted-foreground">
              {isOnline ? "Receiving new requests" : "Not visible to drivers"}
            </span>
          </div>
          <Switch 
            id="online-mode" 
            checked={isOnline}
            onCheckedChange={setIsOnline}
            className="data-[checked]:bg-forest"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Active Job */}
        <div className="md:col-span-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-forest text-white ring-0">
              <CardContent className="p-6">
                <p className="text-white/70 text-sm font-medium mb-1">Today's Earnings</p>
                <p className="text-3xl font-bold">$145.00</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm font-medium mb-1">Jobs Completed</p>
                <p className="text-3xl font-bold text-primary">3</p>
              </CardContent>
            </Card>
          </div>

          {activeRequest ? (
            <Card className="ring-forest">
              <CardHeader className="bg-mist pb-4 pt-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-forest text-lime">ACTIVE JOB</Badge>
                  <span className="text-sm font-medium text-muted-foreground">ETA: 12 mins</span>
                </div>
                <CardTitle>Heading to {activeRequest.user}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-fog flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Destination</p>
                    <p className="text-muted-foreground">Cross street: Main & 5th Ave</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 gap-2" variant="outline">
                    <Phone className="w-4 h-4" /> Call Driver
                  </Button>
                  <Button className="flex-1" onClick={() => setActiveRequest(null)}>
                    Complete Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-fog/60 ring-0">
              <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Navigation className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">No active jobs</p>
                <p className="text-sm mt-1">Wait for requests to appear</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Incoming Requests */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Incoming Requests
            <Badge variant="secondary" className="rounded-full">{isOnline ? pendingRequests.length : 0}</Badge>
          </h2>

          {!isOnline ? (
            <div className="p-12 text-center border rounded-[10px] bg-fog/60">
              <AlertCircle className="w-12 h-12 text-pebble mx-auto mb-4" />
              <h3 className="text-lg font-bold text-obsidian mb-2">You are offline</h3>
              <p className="text-muted-foreground mb-6">Go online to start receiving emergency requests from drivers nearby.</p>
              <Button onClick={() => setIsOnline(true)}>Go Online Now</Button>
            </div>
          ) : pendingRequests.length === 0 ? (
             <div className="p-12 text-center border rounded-[10px] bg-fog/60">
              <div className="w-12 h-12 rounded-full border-4 border-fog border-t-forest animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-obsidian">Listening for requests...</h3>
              <p className="text-muted-foreground">We'll notify you when a driver needs help nearby.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <Card key={req.id} className="border-l-4 border-l-forest">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-mist rounded-full">
                        <req.icon className="w-6 h-6 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{req.problem}</h3>
                        <p className="text-muted-foreground">{req.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-0 bg-lime text-forest mb-1">
                        URGENT
                      </Badge>
                      <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" /> {req.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-fog/60 p-3 rounded-lg mb-6">
                    <MapPin className="w-4 h-4 text-pebble shrink-0" />
                    <span>{req.distance} &bull; Approx. 8 mins away</span>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 gap-2 font-semibold"
                      onClick={() => setActiveRequest(req)}
                    >
                      <Check className="w-5 h-5" /> ACCEPT JOB
                    </Button>
                    <Button variant="outline" className="px-8">
                      <X className="w-5 h-5" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
