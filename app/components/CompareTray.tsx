"use client";

import React from "react";
import { useCompare } from "../context/CompareContext";
import { soundFx } from "../lib/sound";

export default function CompareTray() {
  const { compareVehicles, openCompareModal, removeFromCompare, clearCompare } = useCompare();

  if (compareVehicles.length === 0) return null;

  return (
    <aside
      aria-label="Vehicle Comparison Tray"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 85,
        backgroundColor: "rgba(10, 11, 14, 0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(220, 38, 38, 0.5)",
        borderRadius: "30px",
        padding: "8px 16px 8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(220, 38, 38, 0.3)",
        animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1rem" }}>⚖️</span>
        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Compare ({compareVehicles.length}/3)
        </span>
      </div>

      {/* Thumbnails of selected cars */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {compareVehicles.map((car) => {
          const img = car.images?.[0] || "/hero-bg-desktop.jpg";
          return (
            <div
              key={car.id}
              style={{
                position: "relative",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1.5px solid #ef4444",
                backgroundColor: "#000",
              }}
              title={`${car.make} ${car.model}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={car.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(car.id);
                }}
                title="Remove"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.65rem",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Compare Modal Launch Button */}
      <button
        onClick={openCompareModal}
        style={{
          padding: "6px 14px",
          backgroundColor: "#dc2626",
          border: "none",
          borderRadius: "18px",
          color: "#ffffff",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 0 12px rgba(220, 38, 38, 0.5)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ef4444";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#dc2626";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        View Specs
      </button>

      {/* Clear Button */}
      <button
        onClick={clearCompare}
        title="Clear Tray"
        style={{
          background: "none",
          border: "none",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "0.95rem",
          cursor: "pointer",
          padding: "4px",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
      >
        ✕
      </button>
    </aside>
  );
}

