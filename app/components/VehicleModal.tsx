"use client";

import React, { useState } from "react";
import { Vehicle } from "../lib/types";
import { useAuth } from "../context/AuthContext";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const { requireAuth, user } = useAuth();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");

  if (!vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : ["/hero-bg-desktop.jpg"];

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      setInquirySent(true);
      setTimeout(() => {
        setInquirySent(false);
        onClose();
      }, 2500);
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          backgroundColor: "#0d0e12",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          borderRadius: "14px",
          boxShadow: "0 0 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(220, 38, 38, 0.2)",
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          display: "flex",
          flexDirection: "column",
          animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #8b0000 0%, #dc2626 50%, #8b0000 100%)",
            boxShadow: "0 0 12px rgba(220, 38, 38, 0.8)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.4rem",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 255, 255, 0.8)";
          }}
        >
          &times;
        </button>

        {/* Scrollable Modal Content */}
        <div style={{ overflowY: "auto", padding: "1.8rem 2rem 2.2rem" }}>
          {/* Main Stage Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(240px, 45vw, 420px)",
              backgroundColor: "#050608",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImageIdx] || images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Featured Badge */}
            {vehicle.featured && (
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(220, 38, 38, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  textTransform: "uppercase",
                }}
              >
                <span>★</span> FEATURED
              </div>
            )}

            {/* Category Pill */}
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                padding: "4px 12px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              {vehicle.category}
            </div>
          </div>

          {/* Gallery Thumbnails (if multiple images exist) */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px",
                overflowX: "auto",
                paddingBottom: "6px",
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  style={{
                    width: "80px",
                    height: "52px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: activeImageIdx === idx ? "2px solid #dc2626" : "1px solid rgba(255, 255, 255, 0.15)",
                    padding: 0,
                    backgroundColor: "#000",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`View ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Vehicle Info & Price Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1.6rem",
              paddingBottom: "1.4rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  color: "#dc2626",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {vehicle.make}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  fontWeight: 600,
                  color: "#ffffff",
                  margin: "0 0 6px 0",
                  letterSpacing: "0.04em",
                }}
              >
                {vehicle.model}
              </h2>
              <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem" }}>
                Model Year: {vehicle.year}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", marginBottom: "4px" }}>
                Acquisition Price
              </div>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                }}
              >
                {vehicle.price}
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              marginTop: "1.4rem",
              marginBottom: "1.6rem",
            }}
          >
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{vehicle.category}</div>
            </div>

            {vehicle.color && (
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Exterior Color</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{vehicle.color}</div>
              </div>
            )}

            {vehicle.engine && (
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Powertrain</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{vehicle.engine}</div>
              </div>
            )}

            {vehicle.horsepower && (
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Output</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{vehicle.horsepower}</div>
              </div>
            )}

            {vehicle.transmission && (
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Transmission</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{vehicle.transmission}</div>
              </div>
            )}
          </div>

          {/* Inquiry / Reservation Form */}
          <div
            style={{
              backgroundColor: "rgba(185, 28, 28, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "10px",
              padding: "1.4rem",
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "1.05rem",
                margin: "0 0 6px 0",
                letterSpacing: "0.06em",
              }}
            >
              VIP Acquisition Inquiry
            </h4>
            <p style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.65)", margin: "0 0 1rem 0" }}>
              Request confidential documentation, arrange an exclusive private viewing, or initiate bespoke transport.
            </p>

            {inquirySent ? (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.5)",
                  borderRadius: "6px",
                  color: "#86efac",
                  fontSize: "0.82rem",
                  textAlign: "center",
                }}
              >
                ✓ Inquiry transmitted. A dedicated Rome Motor Cars concierge will contact {user?.email || "you"} shortly.
              </div>
            ) : (
              <form onSubmit={handleInquiry} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Special instructions or private viewing date"
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "0.8rem 1rem",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "4px",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.8rem 1.8rem",
                    backgroundColor: "#b91c1c",
                    border: "1px solid #ef4444",
                    borderRadius: "4px",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b91c1c")}
                >
                  Schedule Private Viewing
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

