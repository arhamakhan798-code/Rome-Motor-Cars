import { NextResponse } from "next/server";
import { insertViewingRecord, getClientViewings, ViewingRecord } from "@/app/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientId,
      username,
      email,
      vehicleId,
      vehicleName,
      vehicleYear,
      requestedDate,
      specialNotes,
    } = body;

    if (!clientId || !vehicleId || !requestedDate) {
      return NextResponse.json(
        { error: "Client ID, Vehicle, and Requested Date are required." },
        { status: 400 }
      );
    }

    // Generate unique Token Number (e.g. RMC-VIEW-4821)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const tokenNumber = `RMC-VIEW-${randomDigits}`;
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const record: ViewingRecord = {
      tokenNumber,
      timestamp: formattedTimestamp,
      clientId,
      username: username || "VIP Client",
      email: email || "",
      vehicleId,
      vehicleName: vehicleName || "Luxury Vehicle",
      vehicleYear: Number(vehicleYear) || 2026,
      requestedDate,
      specialNotes: specialNotes || "",
      status: "In Process",
      lastUpdated: formattedTimestamp,
    };

    await insertViewingRecord(record);

    return NextResponse.json({
      success: true,
      viewing: record,
    });
  } catch (err: unknown) {
    console.error("Viewing submission error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record viewing request." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ success: true, viewings: [] });
    }

    const viewings = await getClientViewings(clientId);
    return NextResponse.json({
      success: true,
      viewings,
    });
  } catch (err: unknown) {
    console.error("Get viewings error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to retrieve viewings." },
      { status: 500 }
    );
  }
}

