"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { soundFx } from "../lib/sound";
import NotificationsModal from "./NotificationsModal";

interface NavbarProps {
  visible: boolean;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Inventory", href: "#inventory" },
  { label: "About", href: "#about" },
];

export default function Navbar({ visible }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasConfirmedNotification, setHasConfirmedNotification] = useState(false);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const { user, isAuthenticated, openAuthModal, openProfileModal, logout } = useAuth();
  const {
    favoritesCount,
    filterFavoritesOnly,
    setFilterFavoritesOnly,
    setEmptyWishlistModalOpen,
  } = useWishlist();
  const { compareVehicles, openCompareModal } = useCompare();
  const [soundActive, setSoundActive] = useState(() => soundFx.isEnabled());

  // Poll notifications status from Google Sheets
  useEffect(() => {
    if (!isAuthenticated || !user?.clientId) {
      setNotificationCount(0);
      setHasConfirmedNotification(false);
      setHasViewedNotifications(false);
      return;
    }

    const storageKey = `rmc_notif_seen_${user.clientId}`;

    async function checkNotifications() {
      try {
        const res = await fetch(`/api/viewings?clientId=${encodeURIComponent(user?.clientId || "")}`);
        if (res.ok) {
          const data = await res.json();
          const viewings = data.viewings || [];
          const count = viewings.length;
          setNotificationCount(count);

          const confirmed = viewings.some((v: { status: string }) =>
            v.status.toLowerCase().includes("confirm") || v.status.toLowerCase().includes("approv")
          );
          setHasConfirmedNotification(confirmed);

          // Show badge only if there are MORE viewings than when user last opened the panel
          const seenCount = parseInt(localStorage.getItem(storageKey) || "0", 10);
          if (count > seenCount) {
            setHasViewedNotifications(false); // new - show badge
          } else {
            setHasViewedNotifications(true);  // already seen - hide badge
          }
        }
      } catch (e) {
        // silent
      }
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.clientId]);

  const isClickScrollingRef = useRef(false);

  // Track active section on scroll
  useEffect(() => {
    let ticking = false;

    const checkActiveSection = () => {
      if (isClickScrollingRef.current) return;

      const scrollY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (scrollY < 150) {
        setActiveSection("Home");
        return;
      }

      const sections = [
        { id: "inventory", label: "Inventory" },
        { id: "collection", label: "Inventory" },
        { id: "about", label: "About" },
      ];

      let found = false;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom > 100) {
            setActiveSection(s.label);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        const viewportMid = window.innerHeight / 2;
        let closest = "Home";
        let closestDist = Infinity;
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el) {
            const dist = Math.abs(el.getBoundingClientRect().top - viewportMid);
            if (dist < closestDist) {
              closestDist = dist;
              closest = s.label;
            }
          }
        }
        if (closestDist < window.innerHeight) setActiveSection(closest);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkActiveSection();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    label: string,
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setActiveSection(label);
    setMenuOpen(false);
    soundFx.playMechanicalClick();

    isClickScrollingRef.current = true;
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);

    if (label === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      return;
    }

    if (label === "Inventory") {
      const el = document.getElementById("inventory") || document.getElementById("collection");
      if (el) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const targetTop = el.getBoundingClientRect().top + scrollY - 75;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", "#inventory");
        }
      }
      return;
    }

    if (label === "About") {
      const el = document.getElementById("about");
      if (el) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const targetTop = el.getBoundingClientRect().top + scrollY - 75;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", "#about");
        }
      }
      return;
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.5rem, 4vw, 4rem)",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 1s ease-out, transform 1s ease-out",
        pointerEvents: visible ? "auto" : "none",
        backgroundColor: "rgba(7, 8, 10, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Brand Logo */}
      <a
        href="#"
        onClick={(e) => handleNavClick("Home", "#", e)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <path
              d="M 22 20 L 58 20 C 74 20, 84 30, 84 44 C 84 56, 75 64, 62 66 L 85 86 L 68 86 L 48 66 L 36 66 L 36 86 L 22 86 Z M 36 34 L 36 54 L 56 54 C 64 54, 70 50, 70 44 C 70 38, 64 34, 56 34 Z"
              fill="#ffffff"
            />
            <path
              d="M 52 66 L 76 86 L 66 86 L 44 66 Z"
              fill="#ef4444"
            />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-cinzel), 'Cinzel', serif",
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            ROME
          </span>
          <span
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: "0.55rem",
              fontWeight: 400,
              letterSpacing: "0.32em",
              color: "rgba(255, 255, 255, 0.55)",
              lineHeight: 1.2,
              marginTop: "2px",
            }}
          >
            MOTOR CARS
          </span>
        </div>
      </a>

      {/* Center Navigation Links */}
      <nav
        className="desktop-nav"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(2rem, 3.5vw, 3.2rem)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item.label, item.href, e)}
              style={{
                position: "relative",
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.08em",
                color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                transition: "color 0.25s ease",
                padding: "8px 0",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                soundFx.playMechanicalClick();
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              {item.label}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "24px",
                    height: "2px",
                    backgroundColor: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                    borderRadius: "2px",
                  }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

        {/* Search Icon */}
        <button
          onClick={() => {
            const invEl = document.getElementById("inventory");
            if (invEl) {
              invEl.scrollIntoView({ behavior: "smooth" });
              const searchInput = invEl.querySelector("input");
              if (searchInput) searchInput.focus();
            }
          }}
          aria-label="Search Collection"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            cursor: "pointer",
            padding: "6px",
            transition: "color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 255, 255, 0.8)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          🔍
        </button>

        {/* Compare Button */}
        {compareVehicles.length > 0 && (
          <button
            onClick={openCompareModal}
            aria-label="Compare Vehicles"
            title={`View Comparison (${compareVehicles.length} vehicles)`}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              color: "#ffffff",
              fontSize: "1.15rem",
              cursor: "pointer",
              padding: "6px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
              soundFx.playMechanicalClick();
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            ⚖️
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "0px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontSize: "0.55rem",
                fontWeight: 700,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 8px rgba(220, 38, 38, 0.6)",
              }}
            >
              {compareVehicles.length}
            </span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={() => {
            const next = soundFx.toggleSound();
            setSoundActive(next);
          }}
          aria-label="Acoustic Feedback Toggle"
          title={soundActive ? "Mechanical Sound: Enabled" : "Mechanical Sound: Muted"}
          style={{
            background: "none",
            border: "none",
            color: soundActive ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.3)",
            fontSize: "1.05rem",
            cursor: "pointer",
            padding: "6px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {soundActive ? "🔊" : "🔇"}
        </button>

        {/* Wishlist / Heart Icon */}
        <button
          onClick={() => {
            if (favoritesCount === 0) {
              setEmptyWishlistModalOpen(true);
            } else {
              setFilterFavoritesOnly((prev) => !prev);
              const invEl = document.getElementById("collection") || document.getElementById("inventory");
              if (invEl) invEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
          aria-label="Wishlist"
          title={
            favoritesCount === 0
              ? "View Favorites (Empty)"
              : filterFavoritesOnly
              ? "Showing Favorites Only (Click to show all cars)"
              : `View My Favorites (${favoritesCount})`
          }
          style={{
            position: "relative",
            background: "none",
            border: "none",
            color: filterFavoritesOnly || favoritesCount > 0 ? "#ef4444" : "rgba(255, 255, 255, 0.8)",
            fontSize: "1.25rem",
            cursor: "pointer",
            padding: "6px",
            transition: "all 0.2s ease",
            transform: filterFavoritesOnly ? "scale(1.15)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2)";
            soundFx.playMechanicalClick();
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = filterFavoritesOnly
              ? "scale(1.15)"
              : "scale(1)";
          }}
        >
          {filterFavoritesOnly ? "♥" : favoritesCount > 0 ? "♥" : "♡"}
          {favoritesCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "0px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontSize: "0.55rem",
                fontWeight: 700,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 8px rgba(220, 38, 38, 0.6)",
              }}
            >
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Notifications Bell */}
        {isAuthenticated && user && (
          <button
            onClick={() => {
              setNotificationsOpen(true);
              setHasViewedNotifications(true);
              const storageKey = `rmc_notif_seen_${user.clientId}`;
              localStorage.setItem(storageKey, String(notificationCount));
            }}
            aria-label="Viewing Notifications"
            title="Private Viewing Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              color: (!hasViewedNotifications && notificationCount > 0) || hasConfirmedNotification
                ? "#22c55e"
                : "rgba(255, 255, 255, 0.85)",
              fontSize: "1.15rem",
              cursor: "pointer",
              padding: "6px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
              soundFx.playMechanicalClick();
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            🔔
            {!hasViewedNotifications && notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "0px",
                  backgroundColor: hasConfirmedNotification ? "#22c55e" : "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: hasConfirmedNotification ? "0 0 10px #22c55e" : "0 0 8px #dc2626",
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>
        )}

        {/* Client Profile / Settings & Sign In */}
        {isAuthenticated && user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={openProfileModal}
              title="Client Profile & Settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px 4px 6px",
                borderRadius: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.6)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.2)";
                e.currentTarget.style.borderColor = "#ef4444";
                soundFx.playMechanicalClick();
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.6)";
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid #dc2626",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{user.username}</span>
              <span style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.6)", marginLeft: "2px" }}>⚙️ Settings</span>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.45)",
                fontSize: "0.65rem",
                cursor: "pointer",
                padding: "4px 6px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)")}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal("login")}
            style={{
              padding: "0.55rem 1.2rem",
              borderRadius: "20px",
              backgroundColor: "#b91c1c",
              border: "1px solid #ef4444",
              color: "#ffffff",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626";
              soundFx.playMechanicalClick();
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b91c1c";
            }}
          >
            Sign In
          </button>
        )}

        {/* Mobile Hamburger Button */}
        <button
          className="hamburger-btn"
          aria-label="Toggle Navigation Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", backgroundColor: "#ffffff" }} />
          <span style={{ display: "block", width: "16px", height: "1.5px", backgroundColor: "#ef4444" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", backgroundColor: "#ffffff" }} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: 0,
            right: 0,
            backgroundColor: "rgba(7, 8, 10, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(220, 38, 38, 0.3)",
            display: "flex",
            flexDirection: "column",
            padding: "1.8rem 2rem",
            gap: "1.2rem",
            zIndex: 60,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(item.label, item.href, e);
              }}
              style={{
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: "0.9rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: activeSection === item.label ? "#ef4444" : "#ffffff",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* VIP Viewing Notifications Modal */}
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </header>
  );
}
