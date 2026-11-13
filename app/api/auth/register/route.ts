import { NextResponse } from "next/server";
import { getAllClients, insertClient, hashPassword } from "@/app/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, avatar } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check Google Sheets for existing clients
    const clients = await getAllClients();

    const existingUser = clients.find(
      (c) =>
        c.username.toLowerCase() === cleanUsername.toLowerCase() ||
        c.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      if (existingUser.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Generate Client ID
    const count = clients.length + 1;
    const clientId = `RMC-USR-${String(count).padStart(4, "0")}`;
    const nowIso = new Date().toISOString();

    const passwordHash = hashPassword(String(password));
    const selectedAvatar = avatar || "/avatars/avatar-1.svg";

    await insertClient({
      clientId,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      avatar: selectedAvatar,
      createdAt: nowIso,
      lastLogin: nowIso,
    });

    return NextResponse.json({
      success: true,
      user: {
        clientId,
        username: cleanUsername,
        email: cleanEmail,
        avatar: selectedAvatar,
        createdAt: nowIso,
        lastLogin: nowIso,
      },
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

