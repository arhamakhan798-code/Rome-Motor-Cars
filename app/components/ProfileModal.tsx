"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const PRESET_AVATARS = [
  { id: "crest-gold", label: "Imperial Crest", src: "/avatars/crest-gold.svg" },
  { id: "supercar-red", label: "Corsa Red", src: "/avatars/supercar-red.svg" },
  { id: "shield-platinum", label: "Platinum Apex", src: "/avatars/shield-platinum.svg" },
  { id: "steering-carbon", label: "Veloce Carbon", src: "/avatars/steering-carbon.svg" },
];

export default function ProfileModal() {
  const { user, profileModalOpen, closeProfileModal, updateProfile, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef(profileModalOpen);

  React.useEffect(() => {
    // Only reinitialize form fields and status message when the modal opens freshly
    if (profileModalOpen && !prevOpenRef.current && user) {
      setUsername(user.username);
      setEmail(user.email);
      setSelectedAvatar(user.avatar);
      setCurrentPassword("");
      setNewPassword("");
      setStatusMsg(null);
    }
    prevOpenRef.current = profileModalOpen;
  }, [user, profileModalOpen]);

  if (!profileModalOpen || !user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ type: "error", text: "Image file must be under 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize down to 120x120 thumbnail to keep base64 string under 10KB (well within Google Sheets limit)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 120;
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          const compressedB64 = canvas.toDataURL("image/jpeg", 0.85);
          setSelectedAvatar(compressedB64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Only require current password if setting a new password
    if (newPassword && !currentPassword) {
      setStatusMsg({
        type: "error",
        text: "Please enter your current password to authorize setting a new password.",
      });
      return;
    }

    setIsSubmitting(true);
    const res = await updateProfile({
      currentPassword: currentPassword || "",
      newUsername: username !== user.username ? username : undefined,
      newEmail: email !== user.email ? email : undefined,
      newPassword: newPassword ? newPassword : undefined,
      newAvatar: selectedAvatar !== user.avatar ? selectedAvatar : undefined,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setStatusMsg({ type: "error", text: res.error || "Failed to update profile." });
    } else {
      setStatusMsg({ type: "success", text: "Account profile updated successfully in registry!" });
      setCurrentPassword("");
      setNewPassword("");
      // Close modal smoothly after user sees success message
      setTimeout(() => {
        closeProfileModal();
      }, 1200);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(220, 38, 38, 0.2)",
          borderRadius: "8px",
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Red Bar */}
        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #8b0000 0%, #dc2626 50%, #8b0000 100%)",
            boxShadow: "0 0 12px rgba(220, 38, 38, 0.8)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "1.4rem",
            cursor: "pointer",
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          &times;
        </button>

        {/* Scrollable Container */}
        <div style={{ padding: "1.8rem 2rem 2rem", overflowY: "auto" }}>
          {/* Client Identity Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              paddingBottom: "1.4rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "1.4rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #dc2626",
                boxShadow: "0 0 16px rgba(220, 38, 38, 0.5)",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedAvatar || user.avatar}
                alt={user.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {user.clientId}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.25rem",
                  margin: "0 0 4px 0",
                  letterSpacing: "0.06em",
                }}
              >
                {user.username}
              </h3>
              <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Feedback Notice */}
          {statusMsg && (
            <div
              style={{
                backgroundColor:
                  statusMsg.type === "success"
                    ? "rgba(34, 197, 94, 0.12)"
                    : "rgba(220, 38, 38, 0.12)",
                border: `1px solid ${
                  statusMsg.type === "success"
                    ? "rgba(34, 197, 94, 0.6)"
                    : "rgba(220, 38, 38, 0.6)"
                }`,
                borderRadius: "4px",
                padding: "0.75rem 1rem",
                marginBottom: "1.2rem",
                color: statusMsg.type === "success" ? "#86efac" : "#fca5a5",
                fontSize: "0.78rem",
              }}
            >
              {statusMsg.text}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* Avatar Selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "0.5rem",
                }}
              >
                Change Avatar or Upload Photo
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {PRESET_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.src;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.src)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        padding: 0,
                        border: isSelected ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: isSelected ? "0 0 12px rgba(239, 68, 68, 0.6)" : "none",
                        backgroundColor: "#111",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={av.src} alt={av.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: "44px",
                    padding: "0 12px",
                    borderRadius: "22px",
                    border: "1px dashed rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.68rem",
                    cursor: "pointer",
                  }}
                >
                  Upload New Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "0.4rem",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "0.4rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "0.4rem",
                }}
              >
                New Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="Enter new password (optional)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* SECURITY AUTHORIZATION (Only strictly required when changing password) */}
            <div
              style={{
                marginTop: "0.6rem",
                padding: "1rem",
                backgroundColor: newPassword ? "rgba(220, 38, 38, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border: newPassword ? "1px solid rgba(220, 38, 38, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: newPassword ? "#fca5a5" : "rgba(255, 255, 255, 0.6)",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                }}
              >
                {newPassword ? "* Enter Current Password to Authorize New Password" : "Current Password (Optional)"}
              </label>
              <input
                type="password"
                placeholder={newPassword ? "Required to authorize new password" : "Only needed if changing password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.9rem",
                  backgroundColor: "#000",
                  border: newPassword ? "1px solid rgba(220, 38, 38, 0.6)" : "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  backgroundColor: "#b91c1c",
                  border: "1px solid #ef4444",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Updating..." : "Save Modifications"}
              </button>

              <button
                type="button"
                onClick={logout}
                style={{
                  padding: "0.85rem 1.4rem",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "4px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

