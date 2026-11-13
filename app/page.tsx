"use client";

import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import IntroAnimation from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import InventorySection from "./components/InventorySection";
import AboutSection from "./components/AboutSection";
import AuthModal from "./components/AuthModal";
import ProfileModal from "./components/ProfileModal";
import EmptyWishlistModal from "./components/EmptyWishlistModal";
import CompareTray from "./components/CompareTray";
import CompareModal from "./components/CompareModal";
import ChatConcierge from "./components/ChatConcierge";

export default function Home() {
  const [introTransitioning, setIntroTransitioning] = useState(false);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <div
            style={{
              minHeight: "100vh",
              width: "100%",
              backgroundColor: "#07080a",
              color: "#ffffff",
              margin: 0,
              padding: 0,
              position: "relative",
              overflowX: "hidden",
            }}
          >
            {/* Full-screen video intro with smooth cross-dissolve & instant skip */}
            <IntroAnimation onComplete={() => setIntroTransitioning(true)} />

            {/* Global Navigation matching reference mockup */}
            <Navbar visible={true} />

            {/* 
            Hero / Landing Page Section:
            "WHERE PERFORMANCE MEETS PRESTIGE" with animated typography emerging
            from both sides, "Explore Our Collection" CTA and "Client Sign In" CTA.
            Users can browse up to this landing page freely without signing in.
          */}
            <div id="home">
              <HeroSection started={introTransitioning} />
            </div>

            {/* 
            Main Collection & Showroom (Anchored at #collection / #inventory):
            Directly mirrors the layout, styling, filter tabs, sorting, 
            and 2026/2027 featured badges from your reference mockup.
            Moving to inventory requires client sign-in.
          */}
            <div id="collection">
              <InventorySection />
            </div>

            {/* 
            Atelier Roma / The Roman Dynasty Vault Lore & About Section (Anchored at #about):
            Immersive high-luxury lore, subterranean climate-stabilized vault protocols,
            the three sacred pillars of Roman mechanical mastery, and imperial seal manifesto.
          */}
            <AboutSection />

            {/* Authentication Modal (Sign In / Register / Avatar selection & upload) */}
            <AuthModal />

            {/* Client Profile / Settings Modal (Modify avatar, photo, username, email, password) */}
            <ProfileModal />

            {/* Empty Wishlist Prompt Modal */}
            <EmptyWishlistModal />

            {/* Floating Vehicle Comparison Tray & Side-by-Side Modal */}
            <CompareTray />
            <CompareModal />

            {/* Floating Private Atelier Concierge Chat (Bottom Right) */}
            <ChatConcierge />
          </div>
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
