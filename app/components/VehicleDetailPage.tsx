"use client";

import React, { useState, useEffect, useRef } from "react";
import { Vehicle } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  onBack: () => void;
}

// Calculate minimum selectable viewing date (must be 2 full intervening buffer days ahead, i.e., today + 3 days)
// Example: If today is the 12th, the earliest selectable date is the 15th
const getMinViewingDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
};

export default function VehicleDetailPage({ vehicle, onBack }: VehicleDetailPageProps) {
  const { user, isAuthenticated, requireAuth, openAuthModal } = useAuth();
  const { isFavorited: checkIsFavorited, toggleWishlist } = useWishlist();

  // Active image index (0, 1, or 2)
  const [activeIdx, setActiveIdx] = useState(0);
  const [bookingSent, setBookingSent] = useState(false);
  const [createdViewing, setCreatedViewing] = useState<{
    tokenNumber: string;
    timestamp: string;
    status: string;
  } | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState(() => getMinViewingDate());
  const [bookingTime, setBookingTime] = useState("14:00");
  const [bookingNotes, setBookingNotes] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : ["/hero-bg-desktop.jpg"];
  const totalImages = images.length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vehicle.id]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % totalImages);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const isFavorited = checkIsFavorited(vehicle.id);
  const toggleFavorite = () => {
    requireAuth(() => {
      toggleWishlist(vehicle.id);
    });
  };

  const handleBookViewingClick = () => {
    requireAuth(() => {
      // Ensure date default adheres to minimum 2 full days advance notice
      if (!bookingDate || bookingDate < getMinViewingDate()) {
        setBookingDate(getMinViewingDate());
      }
      setShowBookingModal(true);
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }

    const minDateStr = getMinViewingDate();
    if (!bookingDate || bookingDate < minDateStr) {
      setBookingError(
        `Viewing sessions require at least 2 full days advance notice. Earliest available date is ${minDateStr}.`
      );
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: user.clientId,
          username: user.username,
          email: user.email,
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.make} ${vehicle.model}`,
          vehicleYear: vehicle.year,
          requestedDate: bookingDate,
          specialNotes: bookingNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Failed to submit viewing request.");
      } else {
        setCreatedViewing(data.viewing);
        setBookingSent(true);
      }
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <article
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#060709",
        color: "#ffffff",
        paddingBottom: "6rem",
        zIndex: 20,
      }}
    >
      {/* ── Top Floating Navigation & Breadcrumbs ── */}
      <div
        style={{
          position: "sticky",
          top: "80px",
          zIndex: 30,
          backgroundColor: "rgba(6, 7, 9, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0.8rem clamp(1.2rem, 4vw, 4rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            color: "#ffffff",
            padding: "0.5rem 1.1rem",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span>‹</span>
          <span>Back to Showroom</span>
        </button>

        {/* Breadcrumb Path */}
        <div
          style={{
            fontSize: "0.74rem",
            color: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={onBack}>Showroom</span>
          <span>/</span>
          <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{vehicle.category}</span>
          <span>/</span>
          <span style={{ color: "#ef4444", fontWeight: 600 }}>{vehicle.make} {vehicle.model}</span>
        </div>

        {/* Quick Wishlist & Share */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={toggleFavorite}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isFavorited ? "#ef4444" : "rgba(255, 255, 255, 0.8)",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isFavorited ? "♥" : "♡"}
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1480px",
          margin: "0 auto",
          padding: "clamp(1.5rem, 3.5vw, 3rem) clamp(1.2rem, 4vw, 4rem)",
        }}
      >
        {/* ── Top Stage: 2-Column Daraz/Luxury App Concept (Media + Purchase Info) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 540px), 1fr))",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            alignItems: "start",
            marginBottom: "3.5rem",
          }}
        >
          {/* ════ LEFT COLUMN: 3-IMAGE SWIPEABLE STAGE ════ */}
          <div>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                backgroundColor: "#0d0e12",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeIdx]}
                alt={`${vehicle.make} ${vehicle.model} - Photo ${activeIdx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  display: "block",
                  transition: "opacity 0.3s ease",
                }}
              />

              {/* Gradient Vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at center, transparent 40%, rgba(6, 7, 9, 0.6) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Navigation Chevrons */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Photo"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "1.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                      e.currentTarget.style.borderColor = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    ‹
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next Photo"
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontSize: "1.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                      e.currentTarget.style.borderColor = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image Counter Pill (1/3) */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{activeIdx + 1}</span>
                <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>/</span>
                <span>{totalImages}</span>
              </div>

              {/* Fullscreen Zoom Trigger */}
              <button
                onClick={() => setFullscreenImage(images[activeIdx])}
                title="Expand Fullscreen"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                ⤢
              </button>
            </div>

            {/* ── 3 Thumbnails Strip ── */}
            {totalImages > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${totalImages}, 1fr)`,
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                {images.map((img, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        position: "relative",
                        aspectRatio: "16 / 10",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: isActive ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.12)",
                        boxShadow: isActive ? "0 0 16px rgba(239, 68, 68, 0.4)" : "none",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        backgroundColor: "#0d0e12",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          opacity: isActive ? 1 : 0.65,
                          transition: "opacity 0.2s ease",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ════ RIGHT COLUMN: VEHICLE IDENTITY, PRICE & ACTIONS ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {/* Top Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {vehicle.featured && (
                <div
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(220, 38, 38, 0.6)",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>★</span> FEATURED {vehicle.year}
                </div>
              )}

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                }}
              >
                {vehicle.category}
              </div>

              {vehicle.status && (
                <div
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.12)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    color: "#4ade80",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "4px 10px",
                    borderRadius: "20px",
                  }}
                >
                  ✓ {vehicle.status}
                </div>
              )}
            </div>

            {/* Title & Brand */}
            <div>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.24em",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {vehicle.make}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "clamp(2rem, 3.2vw, 3rem)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  margin: "0 0 6px 0",
                  color: "#ffffff",
                }}
              >
                {vehicle.model}
              </h1>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)", letterSpacing: "0.08em" }}>
                {vehicle.year} Model Year · Asset Code: {vehicle.id.toUpperCase()}
                {vehicle.trim && ` · ${vehicle.trim}`}
              </div>
            </div>

            {/* Price Block */}
            <div
              style={{
                padding: "1.2rem 1.4rem",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Indicative Acquisition Price
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    fontSize: "clamp(1.8rem, 2.5vw, 2.4rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "0.02em",
                    marginTop: "2px",
                  }}
                >
                  {vehicle.price}
                </div>
              </div>
              {vehicle.priceBasis && (
                <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)", fontStyle: "italic" }}>
                  Basis: {vehicle.priceBasis}
                </div>
              )}
            </div>

            {/* 4 Performance Pillars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              <div
                style={{
                  padding: "0.8rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                }}
              >
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Horsepower
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {vehicle.horsepower || "N/A"}
                </div>
              </div>

              <div
                style={{
                  padding: "0.8rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                }}
              >
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  0–100 km/h
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {vehicle.accel || "N/A"}
                </div>
              </div>

              <div
                style={{
                  padding: "0.8rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                }}
              >
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Top Speed
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {vehicle.topSpeed || "N/A"}
                </div>
              </div>

              <div
                style={{
                  padding: "0.8rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                }}
              >
                <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Torque
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {vehicle.torque || "N/A"}
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              <button
                onClick={handleBookViewingClick}
                style={{
                  width: "100%",
                  padding: "1.1rem",
                  backgroundColor: "#dc2626",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  boxShadow: "0 0 25px rgba(220, 38, 38, 0.45)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b91c1c";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>🏎️</span>
                <span>Book Private Viewing</span>
              </button>

              <button
                onClick={toggleFavorite}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: isFavorited ? "#ef4444" : "rgba(255, 255, 255, 0.85)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                {isFavorited ? "♥ Saved to Wishlist" : "♡ Save to Wishlist"}
              </button>
            </div>

            {/* Trust Assurances */}
            <div
              style={{
                fontSize: "0.72rem",
                color: "rgba(255, 255, 255, 0.55)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                paddingTop: "0.5rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {vehicle.factoryWarranty && (
                <div>🛡️ <strong>Factory Warranty:</strong> {vehicle.factoryWarranty}</div>
              )}
              {vehicle.dealershipWarranty && (
                <div>🛡️ <strong>Dealership Warranty:</strong> {vehicle.dealershipWarranty}</div>
              )}
              {vehicle.serviceInterval && (
                <div>⏱ <strong>Service Interval:</strong> {vehicle.serviceInterval}</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Customer Selling Points & Narrative Description ── */}
        {(vehicle.sellingPoints || vehicle.bestSuitedFor) && (
          <section
            style={{
              marginBottom: "3.5rem",
              padding: "2rem clamp(1.2rem, 3vw, 2.5rem)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.24em",
                color: "#ef4444",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "0.8rem",
              }}
            >
              Vehicle Overview & Curated Character
            </div>

            {vehicle.sellingPoints && (
              <p
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.1rem, 1.4vw, 1.3rem)",
                  lineHeight: 1.8,
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: "0 0 1.2rem 0",
                }}
              >
                &ldquo;{vehicle.sellingPoints}&rdquo;
              </p>
            )}

            {vehicle.bestSuitedFor && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "20px",
                  fontSize: "0.74rem",
                  color: "#ffffff",
                }}
              >
                <span style={{ color: "#ef4444", fontWeight: 700 }}>Best Suited For:</span>
                <span>{vehicle.bestSuitedFor}</span>
              </div>
            )}
          </section>
        )}

        {/* ── Complete Specification Table (All Sheet Columns) ── */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ marginBottom: "1.8rem" }}>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.24em", color: "#ef4444", textTransform: "uppercase", fontWeight: 600 }}>
              Master Technical Dossier
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                fontWeight: 500,
                margin: "4px 0 0 0",
                color: "#ffffff",
              }}
            >
              Comprehensive Vehicle Specifications
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
              gap: "20px",
            }}
          >
            {/* Table 1: Powertrain & Performance */}
            <div
              style={{
                backgroundColor: "#0d0e12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                }}
              >
                1. Powertrain & Performance
              </div>
              <div style={{ padding: "0.6rem 1.2rem" }}>
                <SpecRow label="Engine / Motor" value={vehicle.engine} />
                <SpecRow label="Fuel / Powertrain" value={vehicle.fuel} />
                <SpecRow label="Horsepower" value={vehicle.horsepower} />
                <SpecRow label="Torque" value={vehicle.torque} />
                <SpecRow label="Acceleration (0–100 km/h)" value={vehicle.accel} />
                <SpecRow label="Top Speed" value={vehicle.topSpeed} />
                <SpecRow label="Transmission" value={vehicle.transmission} />
                <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
              </div>
            </div>

            {/* Table 2: Dimensions & Body */}
            <div
              style={{
                backgroundColor: "#0d0e12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                }}
              >
                2. Dimensions & Body
              </div>
              <div style={{ padding: "0.6rem 1.2rem" }}>
                <SpecRow label="Body Style" value={vehicle.bodyStyle} />
                <SpecRow label="Variant / Trim" value={vehicle.trim} />
                <SpecRow label="Seating Capacity" value={vehicle.seats} />
                <SpecRow label="Length" value={vehicle.lengthMm} />
                <SpecRow label="Width" value={vehicle.widthMm} />
                <SpecRow label="Height" value={vehicle.heightMm} />
                <SpecRow label="Boot / Cargo Capacity" value={vehicle.bootCargo} />
              </div>
            </div>

            {/* Table 3: Interior & Technology */}
            <div
              style={{
                backgroundColor: "#0d0e12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                }}
              >
                3. Interior, Comfort & Technology
              </div>
              <div style={{ padding: "0.6rem 1.2rem" }}>
                <SpecRow label="Interior & Comfort" value={vehicle.interiorComfort} />
                <SpecRow label="Infotainment & Connectivity" value={vehicle.infotainment} />
              </div>
            </div>

            {/* Table 4: Safety & Ownership */}
            <div
              style={{
                backgroundColor: "#0d0e12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                }}
              >
                4. Safety, Warranty & Assurance
              </div>
              <div style={{ padding: "0.6rem 1.2rem" }}>
                <SpecRow label="Safety & Driver Assist" value={vehicle.safetyAssist} />
                <SpecRow label="Factory Warranty" value={vehicle.factoryWarranty} />
                <SpecRow label="Dealership Warranty" value={vehicle.dealershipWarranty} />
                <SpecRow label="Service Interval" value={vehicle.serviceInterval} />
                <SpecRow label="Regional Availability" value={vehicle.regionalAvailability} />
                <SpecRow label="Data Confidence" value={vehicle.dataConfidence} />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div style={{ textAlign: "center", paddingTop: "2rem" }}>
          <button
            onClick={onBack}
            style={{
              padding: "0.9rem 2.4rem",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "30px",
              color: "#ffffff",
              fontSize: "0.74rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
              e.currentTarget.style.borderColor = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
          >
            ‹ Return to Full Showroom
          </button>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {showBookingModal && (
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
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "#0d0e12",
              border: "1px solid rgba(220, 38, 38, 0.5)",
              borderRadius: "14px",
              padding: "2rem",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowBookingModal(false);
                setBookingSent(false);
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {bookingSent ? (
              <div style={{ textAlign: "center", padding: "1.2rem 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.6rem" }}>🎉</div>
                <h3
                  style={{
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    fontSize: "1.35rem",
                    color: "#ffffff",
                    margin: "0 0 0.4rem 0",
                  }}
                >
                  Congratulations, {user?.username}!
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.82rem", margin: "0 0 1.2rem 0" }}>
                  Your private viewing session for the <strong>{vehicle.make} {vehicle.model} ({vehicle.year})</strong> has been successfully booked.
                </p>

                {/* Dossier Card */}
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(220, 38, 38, 0.4)",
                    borderRadius: "10px",
                    padding: "1rem 1.2rem",
                    textAlign: "left",
                    marginBottom: "1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>Tracking Token:</span>
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#ef4444",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {createdViewing?.tokenNumber || "RMC-VIEW-PENDING"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>Submission Time:</span>
                    <span style={{ fontSize: "0.75rem", color: "#ffffff" }}>
                      {createdViewing?.timestamp || "Just now"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>Requested Date:</span>
                    <span style={{ fontSize: "0.75rem", color: "#ffffff" }}>{bookingDate}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.5)" }}>Current Status:</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#facc15",
                        backgroundColor: "rgba(234, 179, 8, 0.15)",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        border: "1px solid rgba(234, 179, 8, 0.4)",
                      }}
                    >
                      🟡 IN PROCESS
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.65)",
                    lineHeight: 1.5,
                    backgroundColor: "rgba(234, 179, 8, 0.08)",
                    border: "1px solid rgba(234, 179, 8, 0.25)",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "1.4rem",
                    textAlign: "left",
                  }}
                >
                  🔔 <strong>Concierge Tracking:</strong> When our team confirms your allocation from the showroom registry, your status will update to 🟢 <strong>CONFIRMED</strong>. You can monitor your live status anytime via the notification bell (🔔) in the top navigation bar.
                </div>

                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingSent(false);
                  }}
                  style={{
                    padding: "0.7rem 2rem",
                    backgroundColor: "#dc2626",
                    border: "none",
                    borderRadius: "20px",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)",
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: "#ef4444", textTransform: "uppercase", fontWeight: 600 }}>
                  Private Viewing Request
                </div>
                <h3 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.3rem", color: "#ffffff", margin: "4px 0 1rem 0" }}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </h3>

                {bookingError && (
                  <div
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      color: "#fca5a5",
                      fontSize: "0.75rem",
                      marginBottom: "12px",
                    }}
                  >
                    {bookingError}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>
                      Authenticated Client
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${user?.username} (${user?.clientId})`}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.9rem",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "6px",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.82rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <label style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
                        Preferred Viewing Date
                      </label>
                      <span style={{ fontSize: "0.68rem", color: "#ef4444", letterSpacing: "0.04em" }}>
                        Min 2-day advance notice required
                      </span>
                    </div>
                    <input
                      type="date"
                      required
                      min={getMinViewingDate()}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.9rem",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        boxSizing: "border-box",
                        colorScheme: "dark",
                      }}
                    />
                    <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.45)", marginTop: "4px" }}>
                      Viewing sessions require concierge preparation. Earliest selectable date: {getMinViewingDate()}.
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>
                      Special Requests / Private Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Inquire about track package, delivery arrangements, or private showroom viewing..."
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.9rem",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    style={{
                      marginTop: "0.8rem",
                      width: "100%",
                      padding: "0.9rem",
                      backgroundColor: isSubmittingBooking ? "#7f1d1d" : "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      cursor: isSubmittingBooking ? "not-allowed" : "pointer",
                      boxShadow: "0 0 16px rgba(220, 38, 38, 0.5)",
                      opacity: isSubmittingBooking ? 0.7 : 1,
                    }}
                  >
                    {isSubmittingBooking ? "Transmitting to Concierge Registry..." : "Confirm Private Viewing Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Fullscreen Lightbox ── */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullscreenImage}
            alt="Fullscreen View"
            style={{
              maxWidth: "95vw",
              maxHeight: "92vh",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 0 50px rgba(0, 0, 0, 0.9)",
            }}
          />
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              color: "#ffffff",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "0.55rem 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        gap: "12px",
        fontSize: "0.82rem",
      }}
    >
      <span style={{ color: "rgba(255, 255, 255, 0.5)", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#ffffff", fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

