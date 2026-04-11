"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error?: string;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u);
          setLoading(false);
          console.log("[Auth] User state changed:", u?.uid ?? "logged out");
        },
        (err) => {
          console.error("[Auth] Auth state error:", err);
          setError(err.message || "Failed to initialize auth");
          setLoading(false);
        }
      );
      return unsub;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown auth error";
      console.error("[Auth] Setup error:", msg);
      setError(msg);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
