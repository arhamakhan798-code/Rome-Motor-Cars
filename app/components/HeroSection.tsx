"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface HeroSectionProps {
  started: boolean;
}

export default function HeroSection({ started }: HeroSectionProps) {
  const { isAuthenticated, user, openAuthModal, openProfileModal, requireAuth } = useAuth();

  // Animation stage controller
  // Stage 1: Line expands
  // Stage 2: Headline glides in from left & right
  // Stage 3: Paragraph emerges in center
  // Stage 4: CTA & scroll indicator appear
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!started) return;

    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 400);
    const t3 = setTimeout(() => setStage(3), 1100);
    const t4 = setTimeout(() => setStage(4), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [started]);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      const el = document.getElementById("collection");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "collection";
      }
    });
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "680px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
    >
      {/* ── Background: Carbon Fiber & Ambient Dark Gradients ── */}
      <div
        className="hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/hero-bg-desktop.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
          transform: stage >= 1 ? "scale(1)" : "scale(1.08)",
          transition: "transform 10s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />

      {/* Atmospheric Vignette Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 75%, #000000 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Main Centered Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "860px",
          width: "100%",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          boxSizing: "border-box",
        }}
      >
        {/* Red Accent Divider */}
        <div
          style={{
            height: "2px",
            backgroundColor: "#cc0000",
            boxShadow: "0 0 16px #cc0000, 0 0 32px rgba(204,0,0,0.5)",
            marginBottom: "1.8rem",
            width: stage >= 1 ? "50px" : "0px",
            opacity: stage >= 1 ? 1 : 0,
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
          }}
        />

        {/* ── Headline: Emerging from both sides and meeting in the center ── */}
        <h1
          style={{
            fontFamily: "var(--font-cinzel), 'Cinzel', serif",
            fontWeight: 500,
            fontSize: "clamp(2rem, 4.2vw, 3.8rem)",
            lineHeight: 1.25,
            letterSpacing: "0.08em",
            color: "#ffffff",
            margin: "0 0 1.6rem 0",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Part 1: Glides in from LEFT */}
          <span
            style={{
              display: "inline-block",
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? "translateX(0)" : "translateX(-70px)",
              filter: stage >= 2 ? "blur(0px)" : "blur(8px)",
              transition:
                "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease",
              whiteSpace: "nowrap",
            }}
          >
            Where Performance
          </span>

          {/* Part 2: Glides in from RIGHT */}
          <span
            style={{
              display: "inline-block",
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? "translateX(0)" : "translateX(70px)",
              filter: stage >= 2 ? "blur(0px)" : "blur(8px)",
              transition:
                "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, filter 1s ease 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            Meets Prestige.
          </span>
        </h1>

        {/* Delicate Separator */}
        <div
          style={{
            width: stage >= 3 ? "70px" : "0px",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            marginBottom: "1.6rem",
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* ── Paragraph: Converges smoothly in the center ── */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
            lineHeight: 1.85,
            color: "rgba(255, 255, 255, 0.86)",
            maxWidth: "620px",
            margin: "0 0 2rem 0",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.8)",
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(25px)",
            filter: stage >= 3 ? "blur(0px)" : "blur(4px)",
            transition:
              "opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.1s ease",
          }}
        >
          Welcome to Rome Motor Cars, where exceptional automobiles meet timeless
          elegance. Explore a carefully curated collection of luxury, sports, and
          performance vehicles, each selected for its distinctive character,
          craftsmanship, and engineering. Discover a driving experience that goes
          beyond the ordinary.
        </p>

        {/* ── Buttons Container: Explore + Sign In ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
            transition:
              "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <a
            href="#collection"
            onClick={handleExploreClick}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#ffffff",
              border: "1px solid rgba(220, 38, 38, 0.85)",
              padding: "1rem 2.4rem",
              textDecoration: "none",
              backgroundColor: "rgba(185, 28, 28, 0.8)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 0 25px rgba(220, 38, 38, 0.4)",
              transition:
                "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#dc2626";
              el.style.borderColor = "#ef4444";
              el.style.boxShadow = "0 0 35px rgba(220, 38, 38, 0.65)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "rgba(185, 28, 28, 0.8)";
              el.style.borderColor = "rgba(220, 38, 38, 0.85)";
              el.style.boxShadow = "0 0 25px rgba(220, 38, 38, 0.4)";
              el.style.transform = "translateY(0)";
            }}
          >
            Explore Our Collection
          </a>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal("login")}
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                padding: "1rem 2rem",
                backgroundColor: "rgba(10, 10, 10, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "#ffffff";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.25)";
                el.style.backgroundColor = "rgba(10, 10, 10, 0.5)";
                el.style.transform = "translateY(0)";
              }}
            >
              Client Sign In
            </button>
          ) : (
            <button
              onClick={openProfileModal}
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                padding: "1rem 2rem",
                backgroundColor: "rgba(10, 10, 10, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "#ffffff";
                el.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "rgba(255, 255, 255, 0.25)";
                el.style.backgroundColor = "rgba(10, 10, 10, 0.5)";
                el.style.transform = "translateY(0)";
              }}
            >
              ⚙️ Account Settings
            </button>
          )}
        </div>

        {/* Client Status Badge */}
        {isAuthenticated && user && (
          <div
            style={{
              marginTop: "1.2rem",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              color: "rgba(239, 68, 68, 0.9)",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
            <span>Authenticated Client: {user.username} ({user.clientId})</span>
          </div>
        )}
      </div>

      {/* ── Scroll Prompt ── */}
      <div
        style={{
          position: "absolute",
          bottom: "1.8rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 3,
          opacity: stage >= 4 ? 0.7 : 0,
          transition: "opacity 1.2s ease 0.4s",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "28px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #cc0000 0%, rgba(255,255,255,0.2) 100%)",
              animation: "scrollPulse 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Subtle Bottom Accent Glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, #cc0000 35%, #cc0000 65%, transparent 100%)",
          boxShadow: "0 0 20px rgba(204, 0, 0, 0.6)",
          zIndex: 2,
        }}
      />
    </section>
  );
}
