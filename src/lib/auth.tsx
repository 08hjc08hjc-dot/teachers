"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserName, ALLOWED_USERS } from "@/types";

interface AuthContextValue {
  user: UserName | null;
  login: (name: string) => { ok: boolean; error?: string };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "teacher_day_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserName | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && ALLOWED_USERS.includes(saved as UserName)) {
      setUser(saved as UserName);
    }
    setLoading(false);
  }, []);

  const login = (name: string) => {
    const trimmed = name.trim();
    if (!ALLOWED_USERS.includes(trimmed as UserName)) {
      return { ok: false, error: "등록된 TF 멤버가 아닙니다." };
    }
    setUser(trimmed as UserName);
    localStorage.setItem(STORAGE_KEY, trimmed);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
