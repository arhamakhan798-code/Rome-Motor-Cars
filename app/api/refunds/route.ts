import { NextResponse } from "next/server";
import { insertRefundRequest, getRefundRequestStatus, RefundRecord } from "@/app/lib/sheets";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyerName, buyerNumber, secretNumber, city, address, reason } = body;

    if (!buyerName || !buyerNumber || !secretNumber || !city || !address) {
      return NextResponse.json(
        { error: "Buyer Name, Buyer Number, Secret Number, City, and Physical Address are all required." },
        { status: 400 }
      );
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const requestId = `RMC-RFD-${randomDigits}`;
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const record: RefundRecord = {
      requestId,
      timestamp: formattedTimestamp,
      buyerName: buyerName.trim(),
      buyerNumber: buyerNumber.trim(),
      secretNumber: secretNumber.trim(),
      city: city.trim(),
      address: address.trim(),
      reason: reason ? reason.trim() : "Acquisition Rescission / Condition Audit",
      status: "Pending",
      lastUpdated: formattedTimestamp,
    };

    await insertRefundRequest(record);

    return NextResponse.json({
      success: true,
      requestId,
      status: "Pending",
      message:
        "Your refund request has been officially forwarded to our Executive Inspection Directorate. Your file is registered under Status: PENDING. When our executive team verifies and updates your request to Confirmed in our central ledger, our technical inspection team will be scheduled to visit you in the following week.",
      record,
    });
  } catch (err: unknown) {
    console.error("Refund submission error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record refund request." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerNumber = searchParams.get("buyerNumber");
    const secretNumber = searchParams.get("secretNumber");

    if (!buyerNumber || !secretNumber) {
      return NextResponse.json(
        { error: "Both Buyer Number and Secret Number are required to verify refund status." },
        { status: 400 }
      );
    }

    const record = await getRefundRequestStatus(buyerNumber, secretNumber);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          found: false,
          message: "No matching physical refund file found for the provided Buyer Number and Secret Number. Please verify the physical deed and physical handover passcode.",
        },
        { status: 404 }
      );
    }

    const st = record.status.trim().toLowerCase();
    const isConfirmed = st.includes("confirm") || st.includes("accept") || st.includes("approv");

    let statusMessage = "";
    if (isConfirmed) {
      statusMessage = "Congratulations! Your request has been accepted. Our inspection team will be visiting you in the following week.";
    } else if (st.includes("reject") || st.includes("deni")) {
      statusMessage = "Your refund request could not be approved under our acquisition governance clauses. Please contact your senior atelier advisor.";
    } else {
      statusMessage = "Your request has been forwarded to our Executive Inspection Board and is currently PENDING review. Our inspection team will evaluate your physical credentials shortly.";
    }

    return NextResponse.json({
      success: true,
      found: true,
      record: {
        requestId: record.requestId,
        timestamp: record.timestamp,
        buyerName: record.buyerName,
        buyerNumber: record.buyerNumber,
        city: record.city,
        address: record.address,
        reason: record.reason,
        status: isConfirmed ? "Confirmed" : record.status,
        lastUpdated: record.lastUpdated,
      },
      isConfirmed,
      message: statusMessage,
    });
  } catch (err: unknown) {
    console.error("Refund status check error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to check refund status." },
      { status: 500 }
    );
  }
}
