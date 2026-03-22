"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Zap, Code2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

const FEATURES = [
  { icon: Trophy, text: "LeetCode rank auto-fetched", color: "text-yellow-400" },
  { icon: Code2, text: "Match by tech stack & company", color: "text-neon-green" },
  { icon: Users, text: "Mutual match → WhatsApp link", color: "text-neon-cyan" },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signingIn, error, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      if (profile) {
        router.push("/feed");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  return (
    <div className="relative min-h-screen bg-navy flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern opacity-100 pointer-events-none" />
      <div className="fixed inset-0 spotlight pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-80 h-80 rounded-full bg-neon-green/6 blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-neon-cyan/6 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-navy/70 backdrop-blur-xl px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-green/15 border border-neon-green/30">
            <Zap className="h-4 w-4 text-neon-green" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            Eng<span className="text-neon-green">Nest</span>
          </span>
        </Link>
      </nav>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl p-8 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />

          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-green/15 border border-neon-green/30 mb-4">
              <Zap className="h-8 w-8 text-neon-green" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Welcome to EngNest</h1>
            <p className="text-slate-400 text-sm mt-1 text-center">
              Sign in to find your engineer flatmate
            </p>
          </div>

          <div className="space-y-3 mb-8 p-4 rounded-xl bg-white/3 border border-white/6">
            {FEATURES.map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/15 hover:border-white/30 text-white hover:bg-white/8 gap-3"
            onClick={signInWithGoogle}
            disabled={signingIn || authLoading}
          >
            {signingIn ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {signingIn ? "Signing in..." : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <span className="text-slate-400 underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

        <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-3xl border border-white/4 bg-white/2" />
        <div className="absolute -z-20 -top-8 -left-8 w-full h-full rounded-3xl border border-white/2 bg-white/1" />
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
