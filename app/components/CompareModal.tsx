"use client";

import React from "react";
import { useCompare } from "../context/CompareContext";
import { soundFx } from "../lib/sound";

interface CompareModalProps {
  onSelectVehicle?: (vehicle: unknown) => void;
}

export default function CompareModal({ onSelectVehicle }: CompareModalProps) {
  const { compareVehicles, removeFromCompare, clearCompare, isCompareModalOpen, closeCompareModal } = useCompare();

  if (!isCompareModalOpen) return null;

  const specsList = [
    { label: "Price", key: "price" },
    { label: "Category", key: "category" },
    { label: "Year", key: "year" },
    { label: "Powerplant / Engine", key: "engine", fallback: "Precision Mechanical" },
    { label: "Horsepower", key: "horsepower", fallback: "Vault Calibrated" },
    { label: "Acceleration (0-60)", key: "acceleration", fallback: "Sub-4.0s" },
    { label: "Top Speed", key: "topSpeed", fallback: "Over 190 mph" },
    { label: "Transmission", key: "transmission", fallback: "Dual-Clutch Atelier" },
    { label: "Drivetrain", key: "drivetrain", fallback: "AWD / RWD" },
    { label: "Vault Sanctum", key: "status", fallback: "Subterranean Nitrogen Bay" },
  ];

  return (
    <div
      onClick={closeCompareModal}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 130,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.8rem, 2vw, 2rem)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          backgroundColor: "#0a0b0e",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          borderRadius: "18px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.95), 0 0 45px rgba(220, 38, 38, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.2rem 1.6rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(14, 16, 21, 0.95)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.3rem" }}>⚖️</span>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  margin: 0,
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                }}
              >
                Atelier Comparative Analysis
              </h3>
              <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "2px" }}>
                Side-by-side engineering evaluation across {compareVehicles.length} vehicle{compareVehicles.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={clearCompare}
              style={{
                background: "none",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "rgba(255, 255, 255, 0.6)",
                padding: "4px 10px",
                borderRadius: "14px",
                fontSize: "0.68rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              Clear All
            </button>
            <button
              onClick={closeCompareModal}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "1.4rem",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Comparison Content Table */}
        <div style={{ padding: "1.4rem 1.6rem", overflowY: "auto", flex: 1 }}>
          {compareVehicles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "rgba(255, 255, 255, 0.5)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🏎️</div>
              <h4 style={{ color: "#ffffff", margin: "0 0 0.4rem 0" }}>Comparison Tray Empty</h4>
              <p style={{ fontSize: "0.8rem", maxWidth: "360px", margin: "0 auto", lineHeight: 1.5 }}>
                Tap the &quot;Compare&quot; button on any vehicle card in the collection to view specs side-by-side.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${compareVehicles.length}, minmax(220px, 1fr))`, gap: "12px", minWidth: "600px" }}>
              {/* Header column */}
              <div>
                <div style={{ height: "160px", display: "flex", alignItems: "flex-end", paddingBottom: "12px" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255, 255, 255, 0.45)" }}>
                    Vehicle Profile
                  </span>
                </div>
                {specsList.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      padding: "10px 8px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.6)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Vehicle Columns */}
              {compareVehicles.map((car) => {
                const img = car.images?.[0] || "/hero-bg-desktop.jpg";
                return (
                  <div
                    key={car.id}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top card summary */}
                    <div style={{ height: "160px", padding: "10px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <button
                        onClick={() => removeFromCompare(car.id)}
                        title="Remove from comparison"
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          zIndex: 5,
                          background: "rgba(0, 0, 0, 0.6)",
                          border: "none",
                          color: "#ffffff",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                        }}
                      >
                        ✕
                      </button>
                      <div style={{ height: "90px", width: "100%", overflow: "hidden", borderRadius: "8px", position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={car.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {car.make} {car.model}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 700 }}>
                          {car.price}
                        </div>
                      </div>
                    </div>

                    {/* Spec rows */}
                    {specsList.map((s) => {
                      const val = (car as unknown as Record<string, unknown>)[s.key];
                      return (
                        <div
                          key={s.label}
                          style={{
                            padding: "10px 12px",
                            fontSize: "0.78rem",
                            color: "#ffffff",
                            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                            backgroundColor: "rgba(0, 0, 0, 0.15)",
                            minHeight: "42px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {String(val || s.fallback || "—")}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

