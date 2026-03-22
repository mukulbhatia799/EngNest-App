"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Users, LogOut, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed", label: "Browse", icon: Home },
  { href: "/matches", label: "Matches", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-navy/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-green/15 border border-neon-green/30 group-hover:bg-neon-green/25 transition-colors">
              <Zap className="h-4 w-4 text-neon-green" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              Eng<span className="text-neon-green">Nest</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === href
                      ? "bg-neon-green/10 text-neon-green"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {pathname === href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 h-0.5 w-full bg-neon-green rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <Link href={`/user/${user.uid}`}>
                    <Avatar className="h-8 w-8 ring-2 ring-neon-green/20 hover:ring-neon-green/50 transition-all cursor-pointer">
                      <AvatarImage src={profile?.photo ?? user.photoURL ?? ""} />
                      <AvatarFallback>
                        {(profile?.name ?? user.displayName ?? "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                    <LogOut className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-white/6 bg-navy/95 backdrop-blur-xl px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                pathname === href
                  ? "bg-neon-green/10 text-neon-green"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </motion.div>
      )}
    </header>
  );
}
