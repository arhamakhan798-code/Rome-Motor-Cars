"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

function ShowroomMain() {
  const [introTransitioning, setIntroTransitioning] = useState(false);
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  // Enforce single-page view without sign-in: intercept scroll attempts & prompt authentication
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY > 10) {
          e.preventDefault();
          openAuthModal("login");
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (["ArrowDown", "PageDown", "Space"].includes(e.code)) {
          e.preventDefault();
          openAuthModal("login");
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (window.scrollY > 10) {
          e.preventDefault();
          openAuthModal("login");
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("keydown", handleKeyDown, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [isAuthenticated, isLoading, openAuthModal]);

  const isRestricted = !isAuthenticated && !isLoading;

  return (
    <div
      style={{
        minHeight: "100vh",
        height: isRestricted ? "100vh" : "auto",
        maxHeight: isRestricted ? "100vh" : "none",
        width: "100%",
        backgroundColor: "#07080a",
        color: "#ffffff",
        margin: 0,
        padding: 0,
        position: "relative",
        overflowX: "hidden",
        overflowY: isRestricted ? "hidden" : "visible",
      }}
    >
      {/* Full-screen video intro with smooth cross-dissolve (plays only once per session) */}
      <IntroAnimation onComplete={() => setIntroTransitioning(true)} />

      {/* Global Navigation matching reference mockup */}
      <Navbar visible={true} />

      {/* 
        Hero / Landing Page Section:
        "WHERE PERFORMANCE MEETS PRESTIGE".
        Only this single landing page is accessible freely before client sign-in.
      */}
      <div id="home">
        <HeroSection started={introTransitioning} />
      </div>

      {/* 
        Main Collection & Showroom:
        Accessible only after authentication.
      */}
      <div id="collection" style={{ display: isRestricted ? "none" : "block" }}>
        <InventorySection />
      </div>

      {/* 
        Atelier Roma & Corporate Policies Codex:
        Accessible only after authentication.
      */}
      <div style={{ display: isRestricted ? "none" : "block" }}>
        <AboutSection />
      </div>

      {/* Authentication Modal (Sign In / Register / Avatar selection & upload) */}
      <AuthModal />

      {/* Client Profile / Settings Modal */}
      <ProfileModal />

      {/* Empty Wishlist Prompt Modal */}
      <EmptyWishlistModal />

      {/* Floating Vehicle Comparison Tray & Side-by-Side Modal */}
      <CompareTray />
      <CompareModal />

      {/* Floating Private Atelier Concierge Chat (Bottom Right) */}
      <ChatConcierge />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CompareProvider>
          <ShowroomMain />
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
