"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Vehicle } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { soundFx } from "../lib/sound";
import VehicleDetailPage from "./VehicleDetailPage";
import VehicleModal from "./VehicleModal";

const CATEGORY_ICONS: Record<string, string> = {
  All: "",
  "Sports Cars": "🏆",
  Hypercars: "🚀",
  "Grand Tourers": "🏎️",
  "Luxury Sedans": "🚘",
  "Executive & Comfort": "💎",
  "Ultra-Luxury & Flagship": "👑",
  "Luxury SUVs": "🚙",
  "Performance SUVs": "⚡",
  "Off-Road & 4x4": "🏔️",
  "Electric & Hybrid Luxury": "🔋",
};

export default function InventorySection() {
  const { isAuthenticated, user, openAuthModal, requireAuth } = useAuth();
  const {
    wishlist,
    toggleWishlist: contextToggleWishlist,
    isFavorited,
    filterFavoritesOnly,
    setFilterFavoritesOnly,
  } = useWishlist();
  const { addToCompare, removeFromCompare, isComparing } = useCompare();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sheetCategories, setSheetCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-desc" | "price-asc" | "year-desc" | "name-asc">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live inventory from Google Sheets
  useEffect(() => {
    async function loadInventory() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/inventory");
        if (res.ok) {
          const data = await res.json();
          if (data.vehicles && data.vehicles.length > 0) {
            setVehicles(data.vehicles);
            // Check if car query param exists in URL
            if (typeof window !== "undefined") {
              const params = new URLSearchParams(window.location.search);
              const carParam = params.get("car");
              if (carParam) {
                const found = data.vehicles.find(
                  (v: Vehicle) => v.id.toLowerCase() === carParam.toLowerCase()
                );
                if (found) setSelectedVehicle(found);
              }
            }
          }
          if (data.categories && data.categories.length > 0) {
            setSheetCategories(data.categories);
          }
        }
      } catch (e) {
        console.warn("Could not load Google Sheets live inventory:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInventory();
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const carParam = params.get("car");
      if (!carParam) {
        setSelectedVehicle(null);
      } else {
        const found = vehicles.find((v) => v.id.toLowerCase() === carParam.toLowerCase());
        if (found) setSelectedVehicle(found);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [vehicles]);

  // Compute available categories from sheets
  const categories = useMemo(() => {
    if (sheetCategories.length > 0) {
      return ["All", ...sheetCategories];
    }
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.category) set.add(v.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [sheetCategories, vehicles]);

  // Wishlist toggle
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      contextToggleWishlist(id);
    });
  };

  // Filter & Sort
  const filteredVehicles = useMemo(() => {
    let list = [...vehicles];

    // Filter by favorites only if heart is active
    if (filterFavoritesOnly) {
      list = list.filter((v) => !!wishlist[v.id]);
    }

    // Filter by category
    if (selectedCategory !== "All") {
      list = list.filter((v) => v.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category?.toLowerCase().includes(q) ||
          v.year.toString().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "price-desc") return b.priceNum - a.priceNum;
      if (sortBy === "price-asc") return a.priceNum - b.priceNum;
      if (sortBy === "year-desc") return b.year - a.year;
      if (sortBy === "name-asc") return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
      // Default: newest first (2026/2027 featured first, then by year)
      if (b.year !== a.year) return b.year - a.year;
      return a.number - b.number;
    });

    return list;
  }, [vehicles, selectedCategory, searchQuery, sortBy, filterFavoritesOnly, wishlist]);

  // If a vehicle is selected, display the Dedicated Vehicle Detail Page
  if (selectedVehicle) {
    return (
      <VehicleDetailPage
        vehicle={selectedVehicle}
        onBack={() => {
          setSelectedVehicle(null);
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("car");
            window.history.pushState({}, "", url.toString());
          }
        }}
      />
    );
  }

  return (
    <section
      id="inventory"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#07080a",
        color: "#ffffff",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 3.5rem)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Background Automotive Taillight Glow Accent (Inspired by Reference Image) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "min(60vw, 750px)",
          height: "400px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.65,
        }}
      >
        {/* Aerodynamic rear taillight glow curve */}
        <svg viewBox="0 0 700 350" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <path
            d="M 100 120 C 250 80, 480 80, 680 140"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 16px #ef4444) drop-shadow(0 0 35px #dc2626)"
          />
          <path
            d="M 280 100 C 400 95, 540 105, 680 140"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <path
            d="M 120 150 C 220 135, 380 135, 550 165"
            stroke="#b91c1c"
            strokeWidth="3"
            strokeLinecap="round"
            filter="drop-shadow(0 0 12px #b91c1c)"
            opacity="0.7"
          />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1480px", margin: "0 auto" }}>
        {/* ── Section Header (Copying exact layout from reference picture) ── */}
        <div style={{ marginBottom: "2.4rem" }}>
          {/* Kicker: OUR INVENTORY ————— */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "0.6rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Our Inventory
            </span>
            <span
              style={{
                display: "inline-block",
                width: "48px",
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.25)",
              }}
            />
          </div>

          {/* Title: Explore Our Collection (Collection in red cursive/italic) */}
          <h2
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "#ffffff",
              margin: "0 0 0.8rem 0",
              letterSpacing: "0.02em",
            }}
          >
            Explore Our{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#ef4444",
                textShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
              }}
            >
              Collection
            </span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Discover a premium selection of luxury and performance vehicles.
          </p>
        </div>

        {/* ── Filters & Sorting Bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            paddingBottom: "1rem",
          }}
        >
          {/* Category Pills (horizontally scrollable on mobile) */}
          <div
            className="category-scroll-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              overflowX: "auto",
              paddingBottom: "4px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              maxWidth: "100%",
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const icon = CATEGORY_ICONS[cat] || "";

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.6rem 1.3rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.25s ease",
                    backgroundColor: isActive ? "#dc2626" : "rgba(255, 255, 255, 0.04)",
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                    border: isActive ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: isActive ? "0 0 18px rgba(220, 38, 38, 0.45)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 255, 255, 0.75)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  {icon && <span style={{ fontSize: "0.85rem" }}>{icon}</span>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Search + Sort Dropdown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "auto",
              flexWrap: "wrap",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "0.55rem 1rem 0.55rem 2.2rem",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "20px",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  outline: "none",
                  width: "160px",
                  transition: "all 0.25s ease",
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.width = "220px";
                  e.target.style.borderColor = "#dc2626";
                }}
                onBlur={(e) => {
                  if (!searchQuery) e.target.style.width = "160px";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "10px",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "0.8rem",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                }}
              >
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  padding: "0.55rem 1rem",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                }}
              >
                <option value="newest" style={{ backgroundColor: "#0c0d10", color: "#fff" }}>
                  Newest First
                </option>
                <option value="price-desc" style={{ backgroundColor: "#0c0d10", color: "#fff" }}>
                  Price: High to Low
                </option>
                <option value="price-asc" style={{ backgroundColor: "#0c0d10", color: "#fff" }}>
                  Price: Low to High
                </option>
                <option value="year-desc" style={{ backgroundColor: "#0c0d10", color: "#fff" }}>
                  Year: Newest
                </option>
                <option value="name-asc" style={{ backgroundColor: "#0c0d10", color: "#fff" }}>
                  Make: A-Z
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Vehicle Card Grid (Exact styling from reference image) ── */}
        {/* VIP Client Protection Notice */}
        {!isAuthenticated && (
          <div
            style={{
              marginBottom: "1.8rem",
              padding: "1rem 1.4rem",
              backgroundColor: "rgba(185, 28, 28, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.4)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>🔒</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Client Sign-In Required for Full Fleet Access
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  Sign in or create an account to view 3-angle photography, technical specifications, and reserve private viewings.
                </div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal("login")}
              style={{
                padding: "0.5rem 1.2rem",
                backgroundColor: "#dc2626",
                border: "none",
                borderRadius: "20px",
                color: "#ffffff",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 12px rgba(220, 38, 38, 0.4)",
              }}
            >
              Client Sign In
            </button>
          </div>
        )}

        {/* ── Active Favorites Filter Notice Banner ── */}
        {filterFavoritesOnly && (
          <div
            style={{
              marginBottom: "1.6rem",
              padding: "1rem 1.4rem",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.45)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.4rem", color: "#ef4444" }}>♥</span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Curated Wishlist: Showing {filteredVehicles.length} {filteredVehicles.length === 1 ? "Favorite Vehicle" : "Favorite Vehicles"}
                </div>
                <div style={{ fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px" }}>
                  Displaying exclusively your saved vehicles. Tap the heart in the navigation or click below to view the entire fleet.
                </div>
              </div>
            </div>
            <button
              onClick={() => setFilterFavoritesOnly(false)}
              style={{
                padding: "0.55rem 1.2rem",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
            >
              Show All Cars ✕
            </button>
          </div>
        )}

        {isLoading && vehicles.length === 0 ? (
          <div
            style={{
              padding: "6rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "2px solid rgba(220, 38, 38, 0.2)",
                borderTopColor: "#dc2626",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                fontSize: "1rem",
                letterSpacing: "0.15em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Loading Live Fleet from Google Sheets...
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", letterSpacing: "0.08em" }}>
              Retrieving 205 curated vehicles & high-resolution Drive photography
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "20px",
            }}
          >
          {filteredVehicles.map((car) => {
            const isFavorited = !!wishlist[car.id];
            const primaryImage = car.images && car.images[0] ? car.images[0] : "/hero-bg-desktop.jpg";

            return (
              <div
                key={car.id}
                onClick={() => {
                  requireAuth(() => {
                    soundFx.playVaultTone();
                    setSelectedVehicle(car);
                    if (typeof window !== "undefined") {
                      const url = new URL(window.location.href);
                      url.searchParams.set("car", car.id);
                      window.history.pushState({}, "", url.toString());
                    }
                  });
                }}
                style={{
                  position: "relative",
                  backgroundColor: "#0d0e12",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.borderColor = "rgba(220, 38, 38, 0.45)";
                  el.style.boxShadow = "0 14px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(220, 38, 38, 0.2)";
                  soundFx.playMechanicalClick();
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* ── Card Top: Badge & Heart ── */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    right: "14px",
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  {/* Tag: Only cars of 2026 and 2027 have FEATURED tag */}
                  {car.featured ? (
                    <div
                      style={{
                        backgroundColor: "#dc2626",
                        color: "#ffffff",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(220, 38, 38, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ fontSize: "0.65rem" }}>★</span> FEATURED
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Heart / Favorite Button */}
                  <button
                    onClick={(e) => toggleWishlist(car.id, e)}
                    style={{
                      pointerEvents: "auto",
                      background: "rgba(0, 0, 0, 0.5)",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isFavorited ? "#ef4444" : "rgba(255, 255, 255, 0.7)",
                      fontSize: "1.05rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(6px)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = isFavorited
                        ? "#ef4444"
                        : "rgba(255, 255, 255, 0.7)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                  >
                    {isFavorited ? "♥" : "♡"}
                  </button>
                </div>

                {/* ── Car Image on Studio Floor ── */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "210px",
                    backgroundColor: "#050608",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImage}
                    alt={`${car.make} ${car.model}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    }}
                  />

                  {/* Bottom Vignette Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(13,14,18,0.85) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* ── Card Content ── */}
                <div
                  style={{
                    padding: "1rem 1.2rem 1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Make & Model */}
                    <h3
                      style={{
                        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                        fontSize: "1.02rem",
                        fontWeight: 600,
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {car.make} {car.model}
                    </h3>

                    {/* Year */}
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255, 255, 255, 0.45)",
                        marginTop: "2px",
                      }}
                    >
                      {car.year}
                    </div>
                  </div>

                  {/* Price & Action Button Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                        fontSize: "1.08rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {car.price}
                    </div>

                    {/* Action buttons: Compare toggle + View details */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isComparing(car.id)) {
                            removeFromCompare(car.id);
                          } else {
                            addToCompare(car);
                          }
                        }}
                        title={isComparing(car.id) ? "Remove from comparison" : "Add to comparison"}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "14px",
                          backgroundColor: isComparing(car.id) ? "rgba(220, 38, 38, 0.25)" : "rgba(255, 255, 255, 0.05)",
                          border: isComparing(car.id) ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                          color: isComparing(car.id) ? "#ef4444" : "rgba(255, 255, 255, 0.65)",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={() => soundFx.playMechanicalClick()}
                      >
                        {isComparing(car.id) ? "✓ Compared" : "+ Compare"}
                      </button>

                      {/* Right Arrow Action Circle */}
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.85rem",
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#dc2626";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#ef4444";
                          (e.currentTarget as HTMLDivElement).style.color = "#ffffff";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 14px rgba(220, 38, 38, 0.6)";
                          soundFx.playMechanicalClick();
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255, 255, 255, 0.15)";
                          (e.currentTarget as HTMLDivElement).style.color = "rgba(255, 255, 255, 0.8)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                        }}
                      >
                        ›
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              marginTop: "2rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏎️</div>
            <h3 style={{ fontSize: "1.1rem", color: "#ffffff", margin: "0 0 0.5rem 0" }}>
              No vehicles found matching your criteria
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem", margin: "0 0 1.2rem 0" }}>
              Try selecting another category or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              style={{
                padding: "0.6rem 1.4rem",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Footer Brand Signature (From Reference Image: ———— ROME MOTOR CARS ————) ── */}
        <div
          style={{
            marginTop: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: "200px",
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, #b91c1c 100%)",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "0.78rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
            }}
          >
            ROME &nbsp;MOTOR &nbsp;CARS
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: "200px",
              height: "1px",
              background: "linear-gradient(90deg, #b91c1c 0%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* ── Vehicle Detail Modal ── */}
      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </section>
  );
}

