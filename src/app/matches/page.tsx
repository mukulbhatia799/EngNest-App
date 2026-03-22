"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, MapPin, Briefcase, Loader2, Zap, Trophy } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/providers/AuthProvider";
import { getMutualMatches } from "@/lib/firestore";
import { buildWhatsAppLink, formatExperience, getRatingTier } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    getMutualMatches(user.uid)
      .then(setMatches)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="relative min-h-screen bg-navy">
      <div className="fixed inset-0 grid-pattern opacity-60 pointer-events-none" />
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-green/15 border border-neon-green/30 mb-4">
            <Heart className="h-7 w-7 text-neon-green fill-current" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            Mutual Matches
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Engineers who also expressed interest in you. Connect via WhatsApp.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
            <p className="text-slate-400 text-sm">Loading your matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-6 text-center"
          >
            <div className="h-24 w-24 rounded-3xl bg-white/4 border border-white/8 flex items-center justify-center">
              <Heart className="h-10 w-10 text-slate-500" />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-white">No matches yet</p>
              <p className="text-slate-400 text-sm mt-2 max-w-sm">
                Express interest in engineers from the feed. When they like you back,
                they&apos;ll appear here with a WhatsApp link.
              </p>
            </div>
            <Button onClick={() => router.push("/feed")}>
              <Zap className="h-4 w-4" />
              Browse engineers
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, i) => (
              <MatchCard key={match.uid} match={match} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const tier = getRatingTier(match.leetcodeRating);
  const waLink = buildWhatsAppLink(match.whatsapp, match.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative rounded-2xl border border-neon-green/15 bg-gradient-to-r from-neon-green/5 to-transparent backdrop-blur-sm overflow-hidden group"
    >
      {/* Match glow */}
      <div className="absolute inset-y-0 left-0 w-1 bg-neon-green rounded-l-2xl" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 pl-7">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-2xl overflow-hidden ring-2 ring-neon-green/30">
            {match.photo ? (
              <Image
                src={match.photo}
                alt={match.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-neon-green/20 to-cyan-500/20 flex items-center justify-center">
                <span className="font-display font-bold text-xl text-neon-green">
                  {match.name[0]}
                </span>
              </div>
            )}
          </div>
          {/* Match badge */}
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-neon-green flex items-center justify-center">
            <Heart className="h-3 w-3 text-navy fill-current" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-white text-lg">{match.name}</h3>
            <Badge variant="default" className="text-[10px]">Matched</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {match.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {match.city}
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-yellow-400" />
              <span className={cn("font-mono text-xs font-bold", tier.color)}>
                {match.leetcodeRating === 0 ? "Unrated" : `#${match.leetcodeRating.toLocaleString()}`}
              </span>
            </div>
            <span className="font-mono text-xs text-neon-cyan font-bold">
              {formatExperience(match.experience)}
            </span>
            <div className="flex flex-wrap gap-1">
              {match.techStack.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] text-slate-400 bg-white/5 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2.5 rounded-xl border border-green-500/40 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/60 transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
