import { NextResponse } from "next/server";
import { getAllClients, updateClientRow, verifyPassword, hashPassword } from "@/app/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, currentPassword, newUsername, newEmail, newPassword, newAvatar } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required to authorize modifications." },
        { status: 400 }
      );
    }

    const clients = await getAllClients();
    const client = clients.find((c) => c.clientId === clientId);

    if (!client || !client.rowNumber) {
      return NextResponse.json({ error: "Client account not found." }, { status: 404 });
    }

    let updatedPasswordHash = client.passwordHash;

    // Security check: If attempting to change password, current password MUST be provided and verified
    if (newPassword && String(newPassword).trim().length > 0) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "You must enter your current password to authorize a password change." },
          { status: 400 }
        );
      }
      const isAuth = verifyPassword(String(currentPassword), client.passwordHash);
      if (!isAuth) {
        return NextResponse.json(
          { error: "Incorrect current password. Password modification rejected for security." },
          { status: 403 }
        );
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }
      updatedPasswordHash = hashPassword(String(newPassword));
    } else if (currentPassword) {
      // If client optionally provided current password, verify it matches
      const isAuth = verifyPassword(String(currentPassword), client.passwordHash);
      if (!isAuth) {
        return NextResponse.json(
          { error: "Current password verification failed. Please check your password." },
          { status: 403 }
        );
      }
    }

    let updatedUsername = client.username;
    if (newUsername && String(newUsername).trim().length >= 3) {
      const u = String(newUsername).trim();
      // Check collision
      const exists = clients.find(
        (c) => c.clientId !== clientId && c.username.toLowerCase() === u.toLowerCase()
      );
      if (exists) {
        return NextResponse.json(
          { error: "Username is already taken by another client." },
          { status: 409 }
        );
      }
      updatedUsername = u;
    }

    let updatedEmail = client.email;
    if (newEmail && String(newEmail).trim()) {
      const e = String(newEmail).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(e)) {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      }
      const exists = clients.find(
        (c) => c.clientId !== clientId && c.email.toLowerCase() === e
      );
      if (exists) {
        return NextResponse.json(
          { error: "Email is already in use by another client." },
          { status: 409 }
        );
      }
      updatedEmail = e;
    }

    // Password verification and hash update handled above in security check

    const updatedAvatar = newAvatar || client.avatar;
    const nowIso = new Date().toISOString();

    await updateClientRow(client.rowNumber, {
      clientId: client.clientId,
      username: updatedUsername,
      email: updatedEmail,
      passwordHash: updatedPasswordHash,
      avatar: updatedAvatar,
      createdAt: client.createdAt,
      lastLogin: nowIso,
    });

    return NextResponse.json({
      success: true,
      user: {
        clientId: client.clientId,
        username: updatedUsername,
        email: updatedEmail,
        avatar: updatedAvatar,
        createdAt: client.createdAt,
        lastLogin: nowIso,
      },
    });
  } catch (err: unknown) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update profile." },
      { status: 500 }
    );
  }
}

