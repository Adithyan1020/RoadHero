import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmergencyEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problemType, location } = body;
    
    // For now, using a mock user ID until Clerk is fully wired in
    const mockUserId = "user_mock_" + Date.now();
    
    // Create a mock user if it doesn't exist just to satisfy relations
    let user = await prisma.user.findUnique({ where: { id: mockUserId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: mockUserId,
          email: `${mockUserId}@example.com`,
        }
      });
    }

    const request = await prisma.serviceRequest.create({ 
      data: {
        problemType: problemType || "Unknown",
        latitude: location.lat,
        longitude: location.lng,
        userId: user.id,
        status: "PENDING"
      } 
    });
    
    // Find nearby workshops (Mock logic: just find any verified workshop)
    // In production, we'd use PostGIS for geospatial querying.
    const workshops = await prisma.workshop.findMany({
      where: { verificationStatus: "VERIFIED", isOnline: true },
      include: { user: true }
    });

    // Notify them via Email
    for (const ws of workshops) {
      if (ws.user.email) {
        await sendEmergencyEmail(
          ws.user.email,
          request.problemType,
          request.latitude,
          request.longitude
        );
      }
    }
    
    return NextResponse.json({ success: true, message: "Emergency request created", data: request }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/requests:", error);
    return NextResponse.json({ success: false, message: "Failed to create request" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const requests = await prisma.serviceRequest.findMany();
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch requests" }, { status: 500 });
  }
}

