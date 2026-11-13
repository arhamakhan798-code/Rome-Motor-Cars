"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  clientId: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: "login" | "register";
  profileModalOpen: boolean;
  openAuthModal: (mode?: "login" | "register", intendedAction?: () => void) => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    avatar: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: {
    currentPassword: string;
    newUsername?: string;
    newEmail?: string;
    newPassword?: string;
    newAvatar?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requireAuth: (onSuccess: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "rmc_client_session_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.clientId) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load local session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: "login" | "register" = "login", intendedAction?: () => void) => {
    setAuthModalMode(mode);
    if (intendedAction) {
      setPendingAction(() => intendedAction);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setPendingAction(null);
  };

  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Authentication failed." };
      }
      setUser(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setAuthModalOpen(false);

      // Execute pending guarded action if any
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unable to connect to authentication server.",
      };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    avatar: string;
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Registration failed." };
      }
      setUser(resData.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.user));
      setAuthModalOpen(false);

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unable to connect to registration server.",
      };
    }
  };

  const updateProfile = async (data: {
    currentPassword: string;
    newUsername?: string;
    newEmail?: string;
    newPassword?: string;
    newAvatar?: string;
  }) => {
    if (!user) return { success: false, error: "Not authenticated" };
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: user.clientId,
          ...data,
        }),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Profile update failed." };
      }
      setUser(resData.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.user));
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to server.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    closeProfileModal();
  };

  /**
   * Navigation guard: allows navigation till landing page.
   * Blocks moving to other pages or actions without sign in.
   */
  const requireAuth = (onSuccess: () => void) => {
    if (user) {
      onSuccess();
    } else {
      openAuthModal("login", onSuccess);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalMode,
        profileModalOpen,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        login,
        register,
        updateProfile,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

