"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AboutSection() {
  const { requireAuth } = useAuth();
  const [activePolicyTab, setActivePolicyTab] = useState<number>(0);

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

        {/* ── Corporate Governance & Sovereign Policies Codex ── */}
        <div
          id="policies"
          style={{
            marginBottom: "5rem",
            backgroundColor: "#0a0b0e",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "20px",
            boxShadow: "0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(220, 38, 38, 0.15)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "2.5rem 2rem 1.8rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center",
              background: "linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 14px",
                borderRadius: "20px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                marginBottom: "0.8rem",
              }}
            >
              <span style={{ fontSize: "0.75rem" }}>⚖️</span>
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  color: "#ef4444",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                OFFICIAL CORPORATE GOVERNANCE & ATELIER POLICIES
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 600,
                color: "#ffffff",
                margin: "0 0 0.8rem 0",
                letterSpacing: "0.03em",
              }}
            >
              The Sanctum Codex of{" "}
              <span style={{ color: "#ef4444" }}>Client Trust & Sovereignty</span>
            </h3>

            <p
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "750px",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              Rome Motor Cars observes institutional-grade transparency across provenance certification, viewing protocols, international air transit, voluntary warranties, and sovereign acquisition rescissions.
            </p>

            {/* Policy Category Tabs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              {[
                { label: "01. Inspection & Vault Standards", icon: "🔬" },
                { label: "02. 2-Day Private Viewing Protocol", icon: "🏛️" },
                { label: "03. Enclosed & Air Transport", icon: "✈️" },
                { label: "04. Warranties & Guarantees", icon: "🛡️" },
                { label: "05. Returns & Refund Governance", icon: "📜" },
                { label: "06. Privacy & Swiss Discretion", icon: "🔒" },
              ].map((tab, idx) => {
                const isActive = activePolicyTab === idx;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActivePolicyTab(idx)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "24px",
                      backgroundColor: isActive ? "#dc2626" : "rgba(255, 255, 255, 0.05)",
                      border: isActive ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.12)",
                      color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: isActive ? "0 0 16px rgba(220, 38, 38, 0.5)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div style={{ padding: "2.5rem clamp(1.2rem, 4vw, 3rem)" }}>
            {/* TAB 0: Inspection & Vault Standards */}
            {activePolicyTab === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 1.1 • DIAGNOSTIC PURITY
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    180-Point Atelier Certification
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Every chassis undergoes rigorous ultrasonic chassis alignment verification, multi-layer paint depth micrometry, digital borescope cylinder examination, and dynamometer power certification. Vehicles exhibiting structural compromise or non-original matching components are unconditionally excluded from our reserve.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 1.2 • SUBTERRANEAN ATMOSPHERE
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    21°C / 42% Relative Humidity Vault
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Our subterranean chambers are equipped with continuous HVAC molecular air filtration, dry-nitrogen tire stabilization, and automated microprocessor battery conditioning. Rubber seals, aerospace carbon composites, and hand-stitched Connolly leathers are perpetually safeguarded against thermal stress and oxidation.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 1.3 • FACTORY HISTORICITY
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Sealed Leather Provenance Dossier
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Every acquisition is accompanied by a custom-bound Italian leather ledger containing certified factory build sheets, original delivery consignments, full service invoices, and physical verification plaques stamped with your allocated Buyer Number and Secret Passcode.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 1: 2-Day Private Viewing Protocol */}
            {activePolicyTab === 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 2.1 • ADVANCE NOTICE MANDATE
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Mandatory 2-Day Preparation Buffer
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Private viewings strictly require at least 2 full intervening buffer days (minimum 3 calendar days ahead). This mandatory window allows master technicians to retrieve the chassis from its nitrogen bay, conduct a 36-point pre-viewing fluid check, perform concours preparation, and position the vehicle in our private inspection suite.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 2.2 • 20 SOVEREIGN DESTINATIONS
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Global Atelier Viewing Sanctums
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Our private viewings and technical consultations are hosted across 20 premier hubs: Karachi, Lahore, Islamabad, Dubai, Abu Dhabi, Doha, Riyadh, London, Paris, Monaco, Geneva, Zurich, Milan, New York, Los Angeles, Miami, Tokyo, Singapore, Shanghai, and Hong Kong.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 2.3 • DEDICATED TECHNICAL CURATOR
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    One-on-One Private Host
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Each private viewing session guarantees total discretion and exclusive reservation of the viewing suite. A dedicated mechanical curator will guide you through underbody telemetry, acoustic engine diagnostics, and custom bespoke acquisition terms.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Enclosed & Air Transport */}
            {activePolicyTab === 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 3.1 • ZERO-METER ENCLOSED TRANSIT
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Hydraulic Air-Suspension Transporters
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Continental deliveries are executed exclusively with custom covered transporters featuring pneumatic hydraulic tail-lifts, satellite temperature monitoring, and electronic tamper-evident seal barriers. No vehicle is exposed to open road debris or climatic variation during transit.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 3.2 • DIPLOMATIC AIR FREIGHT
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Chartered Cargo Aircraft Direct Delivery
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    For transatlantic and intercontinental acquisitions, Rome Motor Cars partners directly with premier air freight divisions (Emirates SkyCargo, Lufthansa Cargo, Saudia Cargo). Our diplomatic customs liaisons oversee fast-track tarmac clearance and direct escort to private hangars or residences.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 3.3 • HANDOVER RATIFICATION
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    PDI & Photographic Audit Registry
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Prior to handover, a comprehensive pre-delivery inspection (PDI) with high-resolution photographic documentation is completed. The client verifies the physical tamper seal and ratifies delivery in presence of our certified logistics curator.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Warranties & Guarantees */}
            {activePolicyTab === 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 4.1 • ATELIER PROTECTION
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    12-Month / 15,000 km Powertrain Guarantee
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Every vehicle in our collection carries complimentary 12-month / 15,000 km coverage for internal engine assemblies, transmission gear trains, turbocharger systems, differential assemblies, and electronic hybrid drive units against mechanical defect.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 4.2 • MANUFACTURER CONTINUITY
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Factory Warranty Direct Transfer
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    All active manufacturer factory protections (including Ferrari Power Warranty, Rolls-Royce Provenance, and Porsche Approved terms) are officially transferred to the new custodian. Our atelier manages the administrative transfer with the parent marque.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 4.3 • RECOVERY LIAISON
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    24/7 Diplomatic Roadside Assist
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    In the improbable event of an operational anomaly, our 24/7 dedicated assistance dispatch ensures enclosed recovery and provides a comparable luxury or performance loaner vehicle while your car is serviced in an authorized certified bay.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Returns & Refund Governance */}
            {activePolicyTab === 4 && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "1.8rem" }}>
                  <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                      SECTION 5.1 • STATUTORY COOLING-OFF
                    </div>
                    <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                      14-Day Acquisition Audit Window
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                      Rome Motor Cars affords every registered patron an official 14-day condition audit period post-handover. Should any undisclosed mechanical disparity be verified against our pre-delivery certification, the acquisition is subject to contractual rescission.
                    </p>
                  </div>

                  <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                      SECTION 5.2 • PHYSICAL CREDENTIALS
                    </div>
                    <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                      Physical Buyer & Secret Passcode
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                      To prevent unauthorized tampering, all refund submissions require the physical Buyer Number (engraved on your handover deed) and Secret Physical Number (sealed in your handover dossier). Unverified requests are strictly blocked.
                    </p>
                  </div>

                  <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                      SECTION 5.3 • EXECUTIVE AUDIT PROTOCOL
                    </div>
                    <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                      On-Site Inspection Visit
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                      When a refund request is confirmed by our executive board, an official mechanical inspection team is dispatched directly to the buyer&apos;s physical address in the following week to execute on-site verification and authorize funds transfer.
                    </p>
                  </div>
                </div>

                {/* Direct Action Link to Online Refund Portal */}
                <div
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid rgba(220, 38, 38, 0.4)",
                    borderRadius: "14px",
                    padding: "1.6rem 2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div>
                    <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.2rem", color: "#ffffff", margin: "0 0 4px 0" }}>
                      Need to Initiate an Official Refund Request?
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)", margin: 0, lineHeight: 1.5 }}>
                      Access our secure online portal to submit your physical Buyer Number and Secret Passcode.
                    </p>
                  </div>
                  <a
                    href="/refunds"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 22px",
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      borderRadius: "24px",
                      textDecoration: "none",
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
                    }}
                  >
                    <span>Official Refund Request Portal</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB 5: Privacy & Swiss Discretion */}
            {activePolicyTab === 5 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 6.1 • BANKING-GRADE CONFIDENTIALITY
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Swiss Privacy Protocol
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    Client identities, transactions, and viewing logs are strictly protected under Swiss banking-grade confidentiality standards. No client details are ever disseminated, commercialized, or shared with third-party advertising syndicates.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 6.2 • ANTI-MONEY LAUNDERING & KYC
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Institutional Compliance
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    In accordance with international FATF and EU automotive trade directives, all capital transactions undergo rigorous Anti-Money Laundering (AML) audit and Know-Your-Customer (KYC) clearance prior to title transfer ratification.
                  </p>
                </div>

                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                    SECTION 6.3 • DIPLOMATIC ANONYMITY
                  </div>
                  <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Anonymous Family Office Handling
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.65, margin: 0 }}>
                    For sovereign family offices, royal houses, and ultra-high-net-worth individuals requiring complete public anonymity, acquisitions can be structured through verified corporate trustees with sealed physical registration custody.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
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

