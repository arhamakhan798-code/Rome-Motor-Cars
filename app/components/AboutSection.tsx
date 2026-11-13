"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AboutSection() {
  const { requireAuth } = useAuth();

  const handleScrollToFleet = () => {
    const el = document.getElementById("inventory") || document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#050608",
        color: "#ffffff",
        padding: "clamp(5rem, 8vw, 8rem) clamp(1.2rem, 5vw, 4rem)",
        boxSizing: "border-box",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* ── Background Atmosphere & Ambient Roman Red Aura ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(90vw, 1000px)",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.12) 0%, rgba(185, 28, 28, 0.04) 50%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative Subtle Grid Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1380px", margin: "0 auto" }}>
        {/* ── Section Header ── */}
        <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto 4.5rem auto" }}>
          {/* Roman Kicker */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              padding: "6px 18px",
              borderRadius: "30px",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              marginBottom: "1.6rem",
            }}
          >
            <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>🏛️</span>
            <span
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#ef4444",
              }}
            >
              EST. MCMXXVI &nbsp;•&nbsp; ATELIER ROMA &nbsp;•&nbsp; PRIVATE VAULT
            </span>
          </div>

          {/* Main Display Headline */}
          <h2
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#ffffff",
              margin: "0 0 1.2rem 0",
              letterSpacing: "0.03em",
            }}
          >
            The Architecture of{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#ef4444",
                textShadow: "0 0 35px rgba(239, 68, 68, 0.45)",
              }}
            >
              Mechanical Sovereignty
            </span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)",
              fontStyle: "italic",
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
              margin: "0 auto 1.5rem auto",
            }}
          >
            &ldquo;We do not trade in mere motorcars. We curate kinetic monuments — mechanical sovereign assets born of Italian passion, aerospace carbon composite, and the sacred roar of internal combustion.&rdquo;
          </p>

          <div
            style={{
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
              margin: "0 auto",
            }}
          />
        </div>

        {/* ── Lore Narrative / The Roman Atelier Legend ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            marginBottom: "5rem",
            alignItems: "center",
          }}
        >
          {/* Left Narrative Block */}
          <div
            style={{
              backgroundColor: "rgba(13, 14, 18, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "clamp(2rem, 4vw, 3rem)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "linear-gradient(180deg, #ef4444 0%, transparent 100%)",
              }}
            />

            <h3
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "1.45rem",
                color: "#ffffff",
                marginBottom: "1.2rem",
                letterSpacing: "0.06em",
              }}
            >
              The Sacred Creed of Rome Motor Cars
            </h3>

            <p
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.88rem",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.8,
                marginBottom: "1.2rem",
              }}
            >
              Conceived in the storied shadows of the Eternal City, Rome Motor Cars was founded upon a singular, unyielding decree: that an automobile at the zenith of human engineering is the highest form of modern art. Just as ancient Roman architects shaped marble colosseums to outlast empires, our atelier curates internal combustion masterpieces engineered to dominate time itself.
            </p>

            <p
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.88rem",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              Every chassis gracing our 205-vehicle reserve has undergone exhaustive verification across factory archives in Maranello, Sant’Agata Bolognese, Molsheim, Stuttgart, and Woking. We do not accommodate mass-production compromise. Each vehicle in our care is an apex predator: naturally aspirated V12 symphonies, twin-turbocharged quad-cam monoliths, and bespoke aerodynamic hypercars with zero-tolerance pedigree.
            </p>
          </div>

          {/* Right Highlight Block: The Subterranean Vault ── */}
          <div
            style={{
              backgroundColor: "rgba(18, 10, 12, 0.6)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "16px",
              padding: "clamp(2rem, 4vw, 3rem)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(220, 38, 38, 0.15)",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.4rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                Vault Sanctum Telemetry: Active
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "1.45rem",
                color: "#ffffff",
                marginBottom: "1.2rem",
                letterSpacing: "0.06em",
              }}
            >
              The Subterranean Vault Protocol
            </h3>

            <p
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.88rem",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.8,
                marginBottom: "1.2rem",
              }}
            >
              Hidden beneath fortified subterranean vaults in Rome, Geneva, and Monaco, our fleet is preserved in climate-stabilized chambers maintained strictly at <strong>21°C</strong> and <strong>42% relative humidity</strong>. 
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.82rem",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#ef4444" }}>✓</span>
                <span><strong>Atmospheric Nitrogen Tire Preservation:</strong> Zero pressure decay or rubber degradation.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#ef4444" }}>✓</span>
                <span><strong>Microprocessor Trickle Diagnostics:</strong> 24/7 battery and ECU telemetry sync.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#ef4444" }}>✓</span>
                <span><strong>Master Engine Builder Supervision:</strong> Bi-weekly mechanical lubrication sweeps.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#ef4444" }}>✓</span>
                <span><strong>Biometric Concierge Vault Access:</strong> Exclusive private viewing sessions by appointment.</span>
              </li>
            </ul>

            <button
              onClick={handleScrollToFleet}
              style={{
                padding: "0.75rem 1.8rem",
                backgroundColor: "#dc2626",
                border: "1px solid #ef4444",
                borderRadius: "30px",
                color: "#ffffff",
                fontSize: "0.74rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(220, 38, 38, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(220, 38, 38, 0.4)";
              }}
            >
              Explore the 205-Vehicle Reserve →
            </button>
          </div>
        </div>

        {/* ── The 3 Sovereign Pillars ── */}
        <div style={{ marginBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "#ffffff",
                marginBottom: "0.6rem",
              }}
            >
              The Three Pillars of the Roman Dynasty
            </h3>
            <p
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Every transaction, acquisition, and private showing is governed by century-old standards of secrecy and mechanical perfection.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Pillar I */}
            <div
              style={{
                backgroundColor: "#0b0c10",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "2.5rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "2rem",
                  color: "#ef4444",
                  marginBottom: "0.8rem",
                  fontWeight: 700,
                  textShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
                }}
              >
                I
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  marginBottom: "0.8rem",
                  letterSpacing: "0.04em",
                }}
              >
                Uncompromising Provenance
              </h4>
              <div
                style={{
                  width: "36px",
                  height: "2px",
                  backgroundColor: "rgba(239, 68, 68, 0.5)",
                  marginBottom: "1rem",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(255, 255, 255, 0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                We demand immaculate, unbroken documentation. Every VIN in our collection is cross-referenced with historic factory build-sheets, racing homologation entries, and certified matching-numbers registries.
              </p>
            </div>

            {/* Pillar II */}
            <div
              style={{
                backgroundColor: "#0b0c10",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "2.5rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "2rem",
                  color: "#ef4444",
                  marginBottom: "0.8rem",
                  fontWeight: 700,
                  textShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
                }}
              >
                II
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  marginBottom: "0.8rem",
                  letterSpacing: "0.04em",
                }}
              >
                The 180-Point Acoustic Audit
              </h4>
              <div
                style={{
                  width: "36px",
                  height: "2px",
                  backgroundColor: "rgba(239, 68, 68, 0.5)",
                  marginBottom: "1rem",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(255, 255, 255, 0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Beyond standard visual inspections, our master engineers execute ultrasonic metal-thickness measurements, dyno-verified torque curve mappings, and acoustic frequency audits on every engine and exhaust note.
              </p>
            </div>

            {/* Pillar III */}
            <div
              style={{
                backgroundColor: "#0b0c10",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "2.5rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "2rem",
                  color: "#ef4444",
                  marginBottom: "0.8rem",
                  fontWeight: 700,
                  textShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
                }}
              >
                III
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  marginBottom: "0.8rem",
                  letterSpacing: "0.04em",
                }}
              >
                Diplomatic Air Concierge
              </h4>
              <div
                style={{
                  width: "36px",
                  height: "2px",
                  backgroundColor: "rgba(239, 68, 68, 0.5)",
                  marginBottom: "1rem",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: "0.82rem",
                  color: "rgba(255, 255, 255, 0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                For our global clientele across London, Dubai, Tokyo, and Zurich, we coordinate enclosed, air-suspended transport and chartered cargo aircraft with customs security escort straight to private airfields.
              </p>
            </div>
          </div>
        </div>

        {/* ── Key Reserve Metrics ── */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2.5rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            textAlign: "center",
            marginBottom: "5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              205
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              Curated Masterpieces
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              180
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              Diagnostic Checkpoints
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              21°C / 42%
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              Vault Climate Standard
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "2.8rem",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              100%
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ef4444",
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              Matching Provenance
            </div>
          </div>
        </div>

        {/* ── Roman Atelier Seal & Manifesto Signature ── */}
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            backgroundColor: "rgba(10, 11, 14, 0.9)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "20px",
            boxShadow: "0 0 45px rgba(239, 68, 68, 0.12)",
            position: "relative",
          }}
        >
          {/* Imperial Crest Emblem */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              border: "1.5px solid #ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.4rem auto",
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🦅</span>
          </div>

          <div
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "0.95rem",
              letterSpacing: "0.3em",
              color: "#ef4444",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            SENATVS POPVLVSQVE ROMANVS &nbsp;•&nbsp; ROME MOTOR CARS
          </div>

          <h3
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              color: "#ffffff",
              margin: "0 0 1rem 0",
            }}
          >
            &ldquo;Veloce Come Il Vento, Eterno Come Roma.&rdquo;
          </h3>

          <p
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.6)",
              maxWidth: "550px",
              margin: "0 auto 1.8rem auto",
              lineHeight: 1.6,
            }}
          >
            Signed in sealed council by the Custodians of Atelier Roma. Reserved exclusively for those who appreciate engineering elevated to theology.
          </p>

          <button
            onClick={handleScrollToFleet}
            style={{
              padding: "0.85rem 2.4rem",
              backgroundColor: "#ef4444",
              border: "none",
              borderRadius: "30px",
              color: "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.5)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Request Private Viewing of Fleet
          </button>
        </div>
      </div>
    </section>
  );
}

