"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, AlertTriangle, CheckCircle, XCircle, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState([
    {
      id: "WS-001",
      name: "Mike's Auto Repair",
      owner: "Mike Johnson",
      services: "Towing, Battery, Tires",
      status: "PENDING",
      submitted: "2 hours ago"
    },
    {
      id: "WS-002",
      name: "City Express Towing",
      owner: "Sarah Smith",
      services: "Towing, Lockout",
      status: "VERIFIED",
      submitted: "1 day ago"
    }
  ]);

  const handleVerify = (id: string, status: string) => {
    setWorkshops(ws => ws.map(w => w.id === id ? { ...w, status } : w));
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and verification management</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Verified Workshops</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Emergencies</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 shadow-sm bg-orange-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Verification</p>
              <h3 className="text-2xl font-bold text-orange-600">12</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workshop Verification Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workshop Verifications</CardTitle>
          <CardDescription>Review and approve new provider applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Workshop Name</th>
                  <th className="px-6 py-3">Services</th>
                  <th className="px-6 py-3">Documents</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((ws) => (
                  <tr key={ws.id} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold">{ws.name}</p>
                      <p className="text-slate-500 text-xs">{ws.owner} • {ws.submitted}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{ws.services}</td>
                    <td className="px-6 py-4">
                      <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">View Docs (2)</Button>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ws.status === 'VERIFIED' ? 'default' : ws.status === 'REJECTED' ? 'destructive' : 'secondary'}
                             className={ws.status === 'VERIFIED' ? 'bg-green-500 hover:bg-green-600' : ws.status === 'PENDING' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : ''}>
                        {ws.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {ws.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={() => handleVerify(ws.id, 'VERIFIED')}>
                            <CheckCircle className="w-4 h-4" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleVerify(ws.id, 'REJECTED')}>
                            <XCircle className="w-4 h-4" /> Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
