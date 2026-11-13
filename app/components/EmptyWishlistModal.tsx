"use client";

import React from "react";
import { useWishlist } from "../context/WishlistContext";

export default function EmptyWishlistModal() {
  const { emptyWishlistModalOpen, setEmptyWishlistModalOpen } = useWishlist();

  if (!emptyWishlistModalOpen) return null;

  const handleExplore = () => {
    setEmptyWishlistModalOpen(false);
    const invEl = document.getElementById("collection") || document.getElementById("inventory");
    if (invEl) {
      invEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={() => setEmptyWishlistModalOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 130,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          maxWidth: "440px",
          backgroundColor: "#0d0e12",
          border: "1px solid rgba(220, 38, 38, 0.45)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(220, 38, 38, 0.25)",
          textAlign: "center",
          position: "relative",
          animation: "fadeIn 0.25s ease-out",
        }}
      >
        <button
          onClick={() => setEmptyWishlistModalOpen(false)}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(220, 38, 38, 0.12)",
            border: "1px solid rgba(220, 38, 38, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            color: "#ef4444",
            margin: "0 auto 1.2rem auto",
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
          }}
        >
          ♡
        </div>

        <h3
          style={{
            fontFamily: "var(--font-cinzel), 'Cinzel', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#ffffff",
            margin: "0 0 0.6rem 0",
          }}
        >
          Your Wishlist is Empty
        </h3>

        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: 1.6,
            margin: "0 0 1.6rem 0",
          }}
        >
          You haven&apos;t selected any car as your favorite yet! Click the heart icon (<strong>♡</strong>) on any vehicle card in the showroom to curate your personal dream collection.
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={handleExplore}
            style={{
              padding: "0.75rem 1.8rem",
              backgroundColor: "#dc2626",
              border: "1px solid #ef4444",
              borderRadius: "24px",
              color: "#ffffff",
              fontSize: "0.74rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)",
              transition: "all 0.25s ease",
            }}
          >
            Explore Showroom Fleet
          </button>
        </div>
      </div>
    </div>
  );
}

