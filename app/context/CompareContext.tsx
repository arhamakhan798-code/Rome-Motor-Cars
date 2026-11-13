"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle } from "../lib/types";
import { soundFx } from "../lib/sound";

interface CompareContextType {
  compareVehicles: Vehicle[];
  addToCompare: (vehicle: Vehicle) => void;
  removeFromCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  isComparing: (vehicleId: string) => boolean;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "rmc_compare_tray_v1";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareVehicles, setCompareVehicles] = useState<Vehicle[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompareVehicles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const addToCompare = (vehicle: Vehicle) => {
    soundFx.playMechanicalClick();
    setCompareVehicles((prev) => {
      if (prev.some((v) => v.id === vehicle.id)) return prev;
      if (prev.length >= 3) {
        // limit to 3 vehicles side-by-side
        const replaced = [...prev.slice(1), vehicle];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(replaced));
        return replaced;
      }
      const updated = [...prev, vehicle];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (vehicleId: string) => {
    soundFx.playMechanicalClick();
    setCompareVehicles((prev) => {
      const updated = prev.filter((v) => v.id !== vehicleId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    soundFx.playMechanicalClick();
    setCompareVehicles([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsCompareModalOpen(false);
  };

  const isComparing = (vehicleId: string) => {
    return compareVehicles.some((v) => v.id === vehicleId);
  };

  const openCompareModal = () => {
    soundFx.playVaultTone();
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareVehicles,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}

