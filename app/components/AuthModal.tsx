"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const PRESET_AVATARS = [
  { id: "crest-gold", label: "Imperial Crest", src: "/avatars/crest-gold.svg" },
  { id: "supercar-red", label: "Corsa Red", src: "/avatars/supercar-red.svg" },
  { id: "shield-platinum", label: "Platinum Apex", src: "/avatars/shield-platinum.svg" },
  { id: "steering-carbon", label: "Veloce Carbon", src: "/avatars/steering-carbon.svg" },
];

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(authModalMode);

  // Sync tab with initial mode
  React.useEffect(() => {
    setTab(authModalMode);
  }, [authModalMode]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].src);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!authModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Uploaded image must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setCustomAvatarPreview(b64);
      setSelectedAvatar(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await login(loginIdentifier, loginPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Authentication failed.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      username: regUsername,
      email: regEmail,
      password: regPassword,
      avatar: selectedAvatar,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to create account.");
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
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(220, 38, 38, 0.15)",
          borderRadius: "8px",
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top Red Glowing Bar */}
        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #8b0000 0%, #dc2626 50%, #8b0000 100%)",
            boxShadow: "0 0 12px rgba(220, 38, 38, 0.8)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
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
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ffffff")}
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 255, 255, 0.5)")
          }
        >
          &times;
        </button>

        {/* Modal Header */}
        <div style={{ padding: "1.8rem 2rem 1.2rem", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "1.4rem",
              letterSpacing: "0.15em",
              color: "#ffffff",
              margin: "0 0 0.4rem 0",
              textTransform: "uppercase",
            }}
          >
            Rome Motor Cars
          </h2>
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              color: "rgba(255, 255, 255, 0.55)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Private Client Portal
          </p>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "0 2rem",
          }}
        >
          <button
            onClick={() => {
              setTab("login");
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: "0.8rem 0",
              background: "none",
              border: "none",
              borderBottom: tab === "login" ? "2px solid #dc2626" : "2px solid transparent",
              color: tab === "login" ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab("register");
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: "0.8rem 0",
              background: "none",
              border: "none",
              borderBottom: tab === "register" ? "2px solid #dc2626" : "2px solid transparent",
              color: tab === "register" ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: "1.6rem 2rem 2rem" }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.12)",
                border: "1px solid rgba(220, 38, 38, 0.6)",
                borderRadius: "4px",
                padding: "0.75rem 1rem",
                marginBottom: "1.2rem",
                color: "#fca5a5",
                fontSize: "0.78rem",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#ef4444", fontWeight: "bold" }}>!</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "login" ? (
            /* ── Sign In Form ── */
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
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
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your username or email"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
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
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
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
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: "0.6rem",
                  padding: "0.9rem",
                  backgroundColor: "#b91c1c",
                  border: "1px solid #ef4444",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.35)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b91c1c";
                }}
              >
                {isSubmitting ? "Authenticating..." : "Access Collection"}
              </button>
            </form>
          ) : (
            /* ── Create Account Form ── */
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                  Select Client Avatar or Upload Photo
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {PRESET_AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.src && !customAvatarPreview;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(av.src);
                          setCustomAvatarPreview(null);
                        }}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          padding: 0,
                          border: isSelected ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: isSelected ? "0 0 12px rgba(239, 68, 68, 0.6)" : "none",
                          backgroundColor: "#111",
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av.src} alt={av.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    );
                  })}

                  {/* Upload Custom Photo button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: "48px",
                      padding: "0 14px",
                      borderRadius: "24px",
                      border: customAvatarPreview
                        ? "2px solid #ef4444"
                        : "1px dashed rgba(255, 255, 255, 0.3)",
                      backgroundColor: customAvatarPreview ? "#1a0505" : "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {customAvatarPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customAvatarPreview}
                          alt="Custom"
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span>Custom Photo</span>
                      </>
                    ) : (
                      <span>+ Upload Photo</span>
                    )}
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
                  Desired Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurelius"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
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
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
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
                  required
                  placeholder="client@domain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
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
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
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
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
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
                    onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
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
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
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
                    onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: "0.6rem",
                  padding: "0.9rem",
                  backgroundColor: "#b91c1c",
                  border: "1px solid #ef4444",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.35)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b91c1c";
                }}
              >
                {isSubmitting ? "Registering Client..." : "Create Client Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

