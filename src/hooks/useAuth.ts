"use client";

import { useState } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthContext } from "@/providers/AuthProvider";

export function useAuth() {
  const { user, loading } = useAuthContext();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setSigningIn(false);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return { user, loading, signingIn, error, signInWithGoogle, signOut };
}
