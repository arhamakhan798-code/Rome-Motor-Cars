"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export interface ViewingItem {
  tokenNumber: string;
  timestamp: string;
  clientId: string;
  username: string;
  email: string;
  vehicleId: string;
  vehicleName: string;
  vehicleYear: number;
  requestedDate: string;
  specialNotes: string;
  status: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { user } = useAuth();
  const [viewings, setViewings] = useState<ViewingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    let isMounted = true;
    async function loadViewings() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/viewings?clientId=${encodeURIComponent(user?.clientId || "")}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.viewings) {
            setViewings(data.viewings);
          }
        }
      } catch (e) {
        console.warn("Could not load viewings:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadViewings();
    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          backgroundColor: "#0d0e12",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          borderRadius: "16px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(220, 38, 38, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.4rem 1.6rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.2rem" }}>🔔</span>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  margin: 0,
                  color: "#ffffff",
                }}
              >
                Client Viewing Notifications
              </h3>
              <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "2px" }}>
                Live updates synced with Rome Motor Cars concierge registry
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "1.4rem 1.6rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            flex: 1,
          }}
        >
          {isLoading && viewings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "rgba(255, 255, 255, 0.5)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>⏳</div>
              <div style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Checking concierge registry...
              </div>
            </div>
          ) : viewings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1rem",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>🏎️</div>
              <h4 style={{ color: "#ffffff", fontSize: "0.95rem", margin: "0 0 0.4rem 0" }}>
                No Active Viewing Requests
              </h4>
              <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.78rem", maxWidth: "340px", margin: "0 auto", lineHeight: 1.5 }}>
                Browse our showroom collection and book a private session. Your live tracking tokens and status will appear here.
              </p>
            </div>
          ) : (
            viewings.map((v) => {
              const isConfirmed = v.status.toLowerCase().includes("confirm") || v.status.toLowerCase().includes("approv");
              const isInProcess = v.status.toLowerCase().includes("process") || v.status.toLowerCase().includes("pend");

              return (
                <div
                  key={v.tokenNumber}
                  style={{
                    backgroundColor: isConfirmed ? "rgba(34, 197, 94, 0.06)" : "rgba(255, 255, 255, 0.03)",
                    border: isConfirmed ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "1.2rem 1.4rem",
                    transition: "all 0.25s ease",
                    boxShadow: isConfirmed ? "0 0 20px rgba(34, 197, 94, 0.15)" : "none",
                  }}
                >
                  {/* Top Row: Token & Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          color: "#ffffff",
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        TOKEN #{v.tokenNumber}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)" }}>
                        {v.timestamp}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        backgroundColor: isConfirmed
                          ? "rgba(34, 197, 94, 0.18)"
                          : isInProcess
                          ? "rgba(234, 179, 8, 0.18)"
                          : "rgba(255, 255, 255, 0.08)",
                        color: isConfirmed ? "#4ade80" : isInProcess ? "#facc15" : "#ffffff",
                        border: isConfirmed
                          ? "1px solid #22c55e"
                          : isInProcess
                          ? "1px solid #eab308"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{isConfirmed ? "🟢" : isInProcess ? "🟡" : "⚪"}</span>
                      <span>{v.status}</span>
                    </div>
                  </div>

                  {/* Vehicle Title */}
                  <h4
                    style={{
                      fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      margin: "0 0 6px 0",
                    }}
                  >
                    {v.vehicleName} ({v.vehicleYear})
                  </h4>

                  {/* Date & Location */}
                  <div style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.75)", marginBottom: "8px" }}>
                    📅 <strong>Scheduled Date:</strong> {v.requestedDate} &nbsp;·&nbsp; 📍 Rome Motor Cars Lounge
                  </div>

                  {/* Notification Status Message */}
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      backgroundColor: isConfirmed ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      border: isConfirmed ? "1px solid rgba(34, 197, 94, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                      fontSize: "0.75rem",
                      lineHeight: 1.5,
                      color: isConfirmed ? "#dcfce7" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {isConfirmed ? (
                      <>
                        🎉 <strong>Congratulations!</strong> Your private viewing session has been{" "}
                        <span style={{ color: "#4ade80", fontWeight: 700 }}>CONFIRMED</span> by the showroom concierge.
                        The vehicle will be prepped and positioned in our private inspection bay. We are excited to meet you at the showroom!
                      </>
                    ) : (
                      <>
                        🟡 <strong>Request Received:</strong> Your request has been logged in our registry with status{" "}
                        <span style={{ color: "#facc15", fontWeight: 600 }}>In Process</span>. Our concierge team is reviewing allocation. Once confirmed in our master sheet, this card will automatically update to Confirmed.
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.6rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "right",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.6rem 1.4rem",
              backgroundColor: "#dc2626",
              border: "none",
              borderRadius: "20px",
              color: "#ffffff",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

