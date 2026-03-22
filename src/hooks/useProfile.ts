"use client";

import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/firestore";
import { useAuthContext } from "@/providers/AuthProvider";
import type { UserProfile } from "@/types";

export function useProfile() {
  const { user, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserProfile(user.uid)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  function refreshProfile() {
    if (!user) return;
    setLoading(true);
    getUserProfile(user.uid)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return { profile, loading: authLoading || loading, error, refreshProfile };
}
