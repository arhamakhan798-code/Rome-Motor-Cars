import { NextResponse } from "next/server";
import { getAllClients, updateClientRow, verifyPassword } from "@/app/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be username or email

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please enter your username and password." },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).trim().toLowerCase();

    // Fetch clients from Google Sheet
    const clients = await getAllClients();

    const client = clients.find(
      (c) =>
        c.username.toLowerCase() === cleanId ||
        c.email.toLowerCase() === cleanId
    );

    if (!client) {
      return NextResponse.json(
        { error: "No account found matching this username or email." },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = verifyPassword(String(password), client.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password. Access denied." },
        { status: 401 }
      );
    }

    // Update last login timestamp in Google Sheet
    const nowIso = new Date().toISOString();
    if (client.rowNumber) {
      try {
        await updateClientRow(client.rowNumber, {
          clientId: client.clientId,
          username: client.username,
          email: client.email,
          passwordHash: client.passwordHash,
          avatar: client.avatar,
          createdAt: client.createdAt,
          lastLogin: nowIso,
        });
      } catch (e) {
        console.warn("Could not update lastLogin timestamp:", e);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        clientId: client.clientId,
        username: client.username,
        email: client.email,
        avatar: client.avatar,
        createdAt: client.createdAt,
        lastLogin: nowIso,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Authentication failed." },
      { status: 500 }
    );
  }
}

