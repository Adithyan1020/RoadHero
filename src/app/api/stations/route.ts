import { NextResponse } from "next/server";
import { findStations } from "@/lib/stations";

const ALLOWED_RADII = [2000, 5000, 10000, 20000];

// GET /api/stations?lat=10.02&lng=76.30&radius=5000
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radius = Number(searchParams.get("radius") ?? 5000);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ success: false, message: "A valid lat and lng are required" }, { status: 400 });
  }
  if (!ALLOWED_RADII.includes(radius)) {
    return NextResponse.json(
      { success: false, message: `radius must be one of ${ALLOWED_RADII.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const stations = await findStations(lat, lng, radius);
    return NextResponse.json({ success: true, data: stations });
  } catch (error) {
    console.error("Error in GET /api/stations:", error);
    return NextResponse.json(
      { success: false, message: "The station map service is busy. Please try again in a minute." },
      { status: 502 }
    );
  }
}
