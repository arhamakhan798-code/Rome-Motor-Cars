"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlist: Record<string, boolean>;
  favoritesCount: number;
  toggleWishlist: (vehicleId: string) => void;
  isFavorited: (vehicleId: string) => boolean;
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  emptyWishlistModalOpen: boolean;
  setEmptyWishlistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "rmc_client_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [emptyWishlistModalOpen, setEmptyWishlistModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setWishlist(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage:", e);
    }
  }, []);

  const toggleWishlist = (vehicleId: string) => {
    setWishlist((prev) => {
      const updated = { ...prev, [vehicleId]: !prev[vehicleId] };
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save wishlist to localStorage:", e);
      }
      return updated;
    });
  };

  const isFavorited = (vehicleId: string) => {
    return !!wishlist[vehicleId];
  };

  const favoritesCount = Object.values(wishlist).filter(Boolean).length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        favoritesCount,
        toggleWishlist,
        isFavorited,
        filterFavoritesOnly,
        setFilterFavoritesOnly,
        emptyWishlistModalOpen,
        setEmptyWishlistModalOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

