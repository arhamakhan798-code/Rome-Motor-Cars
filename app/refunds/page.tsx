"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ATELIER_CITIES } from "../lib/cities";

export default function RefundRequestPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "status">("submit");

  // Submit Form State
  const [buyerName, setBuyerName] = useState("");
  const [buyerNumber, setBuyerNumber] = useState("");
  const [secretNumber, setSecretNumber] = useState("");
  const [city, setCity] = useState("Dubai");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    requestId: string;
    message: string;
    status: string;
  } | null>(null);

  // Status Check Form State
  const [checkBuyerNumber, setCheckBuyerNumber] = useState("");
  const [checkSecretNumber, setCheckSecretNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<{
    found: boolean;
    record?: {
      requestId: string;
      timestamp: string;
      buyerName: string;
      buyerNumber: string;
      city: string;
      address: string;
      reason: string;
      status: string;
    };
    isConfirmed: boolean;
    message: string;
  } | null>(null);

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerNumber.trim() || !secretNumber.trim() || !address.trim()) {
      setSubmitError("Please fill in all required fields including physical deed credentials.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerNumber,
          secretNumber,
          city,
          address,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit refund request.");
      } else {
        setSubmittedData({
          requestId: data.requestId,
          message: data.message,
          status: data.status,
        });
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkBuyerNumber.trim() || !checkSecretNumber.trim()) {
      setCheckError("Please enter both your physical Buyer Number and Secret Number.");
      return;
    }

    setIsChecking(true);
    setCheckError(null);
    setStatusResult(null);

    try {
      const res = await fetch(
        `/api/refunds?buyerNumber=${encodeURIComponent(checkBuyerNumber.trim())}&secretNumber=${encodeURIComponent(
          checkSecretNumber.trim()
        )}`
      );

      const data = await res.json();
      if (!res.ok) {
        setCheckError(data.error || data.message || "Failed to look up refund file.");
      } else {
        setStatusResult(data);
      }
    } catch (err: unknown) {
      setCheckError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#07080a",
        color: "#ffffff",
        margin: 0,
        padding: 0,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        position: "relative",
      }}
    >
      {/* ── Top Atelier Navigation Bar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(10, 11, 14, 0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(220, 38, 38, 0.3)",
          padding: "1rem clamp(1.2rem, 4vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🏛️</span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#ffffff",
              }}
            >
              ROME MOTOR CARS
            </div>
            <div
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                color: "#ef4444",
                textTransform: "uppercase",
              }}
            >
              EXECUTIVE REFUND & RESCISSION DIRECTORATE
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            ← Return to Showroom
          </Link>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main style={{ maxWidth: "980px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) 1.2rem" }}>
        {/* Title Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 14px",
              borderRadius: "20px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>📜</span>
            <span
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                color: "#ef4444",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              OFFICIAL ACQUISITION RESCISSION PROTOCOL
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 600,
              color: "#ffffff",
              margin: "0 0 1rem 0",
              letterSpacing: "0.03em",
            }}
          >
            Client <span style={{ color: "#ef4444" }}>Refund & Rescission</span> Portal
          </h1>

          <p
            style={{
              fontSize: "0.88rem",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            In accordance with Section 9 of the Rome Motor Cars Corporate Governance Handbook, verified patrons may initiate an acquisition refund request. All requests require physical deed credentials and undergo executive verification before on-site inspection scheduling.
          </p>

          {/* Mode Tabs */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "30px",
              padding: "4px",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={() => setActiveTab("submit")}
              style={{
                padding: "10px 24px",
                borderRadius: "24px",
                border: "none",
                backgroundColor: activeTab === "submit" ? "#dc2626" : "transparent",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: activeTab === "submit" ? "0 0 16px rgba(220, 38, 38, 0.5)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              1. Submit Refund Request
            </button>
            <button
              onClick={() => setActiveTab("status")}
              style={{
                padding: "10px 24px",
                borderRadius: "24px",
                border: "none",
                backgroundColor: activeTab === "status" ? "#dc2626" : "transparent",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: activeTab === "status" ? "0 0 16px rgba(220, 38, 38, 0.5)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              2. Check Request Status
            </button>
          </div>
        </div>

        {/* ── TAB 1: SUBMIT REFUND REQUEST ── */}
        {activeTab === "submit" && (
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid rgba(220, 38, 38, 0.4)",
              borderRadius: "16px",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(220, 38, 38, 0.15)",
            }}
          >
            {submittedData ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(234, 179, 8, 0.15)",
                    border: "2px solid #eab308",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    margin: "0 auto 1.5rem auto",
                    boxShadow: "0 0 25px rgba(234, 179, 8, 0.3)",
                  }}
                >
                  ⏳
                </div>

                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#facc15",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  ✓ REFUND REQUEST FORWARDED
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    fontSize: "1.8rem",
                    color: "#ffffff",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Registration Reference: <span style={{ color: "#ef4444" }}>{submittedData.requestId}</span>
                </h3>

                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(234, 179, 8, 0.15)",
                    border: "1px solid rgba(234, 179, 8, 0.4)",
                    color: "#facc15",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "1.5rem",
                  }}
                >
                  🟡 STATUS: PENDING EXECUTIVE REVIEW
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.75)",
                    lineHeight: 1.7,
                    maxWidth: "620px",
                    margin: "0 auto 2rem auto",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {submittedData.message}
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setCheckBuyerNumber(buyerNumber);
                      setCheckSecretNumber(secretNumber);
                      setActiveTab("status");
                    }}
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#dc2626",
                      border: "none",
                      borderRadius: "24px",
                      color: "#ffffff",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)",
                    }}
                  >
                    Track Request Status Live →
                  </button>
                  <button
                    onClick={() => setSubmittedData(null)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "24px",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRefund}>
                <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                      fontSize: "1.4rem",
                      color: "#ffffff",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Physical Purchase Credentials & Location
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
                    Please reference the physical leather deed and security dossier handed over at vehicle delivery.
                  </p>
                </div>

                {submitError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid #ef4444",
                      borderRadius: "8px",
                      color: "#fca5a5",
                      fontSize: "0.8rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                      Full Name of Buyer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Julian Sterling"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                      Buyer Number (Allocated Physically at Purchase) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RMC-B-8492"
                      value={buyerNumber}
                      onChange={(e) => setBuyerNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <span style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)", marginTop: "4px", display: "block" }}>
                      Stamped on physical handover deed.
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                      Secret Number (Given Physically at Purchase) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SEC-7391"
                      value={secretNumber}
                      onChange={(e) => setSecretNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <span style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)", marginTop: "4px", display: "block" }}>
                      Sealed inside confidential handover folder.
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                      Atelier City (Select from 20 Sovereign Hubs) *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "#111318",
                        border: "1px solid rgba(220, 38, 38, 0.4)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    >
                      {ATELIER_CITIES.map((c) => (
                        <option key={c} value={c} style={{ backgroundColor: "#111318", color: "#ffffff" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                    Physical Address for Inspection Team Visit *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter full physical residential or private hangar address where our technical inspection team will arrive..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                    Vehicle Model & Primary Reason for Rescission
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 2024 Rolls-Royce Phantom — Exercising contractual cooling-off window..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: isSubmitting ? "#7f1d1d" : "#dc2626",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 0 25px rgba(220, 38, 38, 0.45)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSubmitting ? "Transmitting to Central Registry..." : "Submit Official Refund Request"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── TAB 2: CHECK REQUEST STATUS ── */}
        {activeTab === "status" && (
          <div
            style={{
              backgroundColor: "#0d0e12",
              border: "1px solid rgba(220, 38, 38, 0.4)",
              borderRadius: "16px",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(220, 38, 38, 0.15)",
            }}
          >
            <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  margin: "0 0 6px 0",
                }}
              >
                Query Central Directorate Ledger
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
                Enter your physical Buyer Number and Secret Passcode to view your live verification status.
              </p>
            </div>

            {checkError && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  color: "#fca5a5",
                  fontSize: "0.8rem",
                  marginBottom: "1.5rem",
                }}
              >
                {checkError}
              </div>
            )}

            <form onSubmit={handleCheckStatus} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "2rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                  Buyer Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RMC-B-8492"
                  value={checkBuyerNumber}
                  onChange={(e) => setCheckBuyerNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)", display: "block", marginBottom: "6px" }}>
                  Secret Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SEC-7391"
                  value={checkSecretNumber}
                  onChange={(e) => setCheckSecretNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="submit"
                  disabled={isChecking}
                  style={{
                    width: "100%",
                    padding: "11px",
                    backgroundColor: isChecking ? "#7f1d1d" : "#dc2626",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: isChecking ? "not-allowed" : "pointer",
                    boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)",
                  }}
                >
                  {isChecking ? "Querying..." : "Verify Status"}
                </button>
              </div>
            </form>

            {/* Status Results Card */}
            {statusResult && (
              <div
                style={{
                  padding: "1.8rem",
                  borderRadius: "12px",
                  backgroundColor: statusResult.isConfirmed ? "rgba(34, 197, 94, 0.12)" : "rgba(234, 179, 8, 0.1)",
                  border: statusResult.isConfirmed ? "1.5px solid #22c55e" : "1.5px solid #eab308",
                  boxShadow: statusResult.isConfirmed ? "0 0 35px rgba(34, 197, 94, 0.25)" : "0 0 25px rgba(234, 179, 8, 0.2)",
                  marginTop: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.8rem" }}>{statusResult.isConfirmed ? "🎉" : "⏳"}</span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: statusResult.isConfirmed ? "#4ade80" : "#facc15",
                          fontWeight: 700,
                        }}
                      >
                        {statusResult.isConfirmed ? "REQUEST ACCEPTED & CONFIRMED" : "REQUEST REGISTERED • PENDING REVIEW"}
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-cinzel), 'Cinzel', serif" }}>
                        FILE #{statusResult.record?.requestId}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      backgroundColor: statusResult.isConfirmed ? "rgba(34, 197, 94, 0.25)" : "rgba(234, 179, 8, 0.25)",
                      color: statusResult.isConfirmed ? "#86efac" : "#fde047",
                      border: statusResult.isConfirmed ? "1px solid #4ade80" : "1px solid #eab308",
                    }}
                  >
                    {statusResult.isConfirmed ? "🟢 CONFIRMED" : "🟡 PENDING"}
                  </span>
                </div>

                {/* Primary Message */}
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    lineHeight: 1.6,
                    color: statusResult.isConfirmed ? "#dcfce7" : "#fef08a",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    padding: "14px 18px",
                    borderRadius: "8px",
                    marginBottom: "1.2rem",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {statusResult.message}
                </div>

                {/* Record Details Grid */}
                {statusResult.record && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                      fontSize: "0.78rem",
                      color: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)" }}>Registered Buyer</div>
                      <div style={{ fontWeight: 600, color: "#ffffff" }}>{statusResult.record.buyerName}</div>
                    </div>

                    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)" }}>Atelier Hub City</div>
                      <div style={{ fontWeight: 600, color: "#ef4444" }}>{statusResult.record.city}</div>
                    </div>

                    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)" }}>Inspection Address</div>
                      <div style={{ fontWeight: 600, color: "#ffffff" }}>{statusResult.record.address}</div>
                    </div>

                    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)" }}>Filing Timestamp</div>
                      <div style={{ fontWeight: 600, color: "#ffffff" }}>{statusResult.record.timestamp}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Official Policy Guarantee Banner ── */}
        <div
          style={{
            marginTop: "3.5rem",
            padding: "1.8rem 2rem",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
              INSTITUTIONAL INTEGRITY
            </div>
            <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.05rem", color: "#ffffff", margin: "0 0 6px 0" }}>
              Certified On-Site Verification
            </h4>
            <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.65)", margin: 0, lineHeight: 1.6 }}>
              Our executive inspection teams are senior mechanical directors equipped with paint depth meters, telemetry analyzers, and borescope cameras to conduct rapid on-site certification.
            </p>
          </div>

          <div>
            <div style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
              SWISS FINANCIAL SETTLEMENT
            </div>
            <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.05rem", color: "#ffffff", margin: "0 0 6px 0" }}>
              Original Payment Channel Reversal
            </h4>
            <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.65)", margin: 0, lineHeight: 1.6 }}>
              Upon successful on-site inspection ratification, funds are returned directly to the originating bank escrow or verified client account within 48 banking hours.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
