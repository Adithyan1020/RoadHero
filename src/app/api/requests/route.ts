import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmergencyEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Please sign in first" }, { status: 401 });
    }

    const body = await req.json();
    const { problemType, location, description } = body;

    if (
      typeof location?.lat !== "number" ||
      typeof location?.lng !== "number" ||
      Math.abs(location.lat) > 90 ||
      Math.abs(location.lng) > 180
    ) {
      return NextResponse.json({ success: false, message: "A valid location is required" }, { status: 400 });
    }

    const request = await prisma.serviceRequest.create({
      data: {
        problemType: typeof problemType === "string" && problemType ? problemType : "other",
        description: typeof description === "string" && description.trim() ? description.trim().slice(0, 1000) : null,
        latitude: location.lat,
        longitude: location.lng,
        userId: user.id,
        status: "PENDING",
      },
    });

    // Find nearby workshops (for now: every verified, online workshop).
    // TODO: filter by distance using each workshop's serviceRadius.
    const workshops = await prisma.workshop.findMany({
      where: { verificationStatus: "VERIFIED", isOnline: true },
      include: { user: true },
    });

    for (const ws of workshops) {
      if (ws.user.email) {
        await sendEmergencyEmail(ws.user.email, request.problemType, request.latitude, request.longitude);
      }
    }

    return NextResponse.json(
      { success: true, message: "Emergency request created", data: request },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/requests:", error);
    return NextResponse.json({ success: false, message: "Failed to create request" }, { status: 500 });
  }
}

// Admins see every request; everyone else sees only their own.
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Please sign in first" }, { status: 401 });
    }

    const requests = await prisma.serviceRequest.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error in GET /api/requests:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch requests" }, { status: 500 });
  }
}
