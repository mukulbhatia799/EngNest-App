"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  Code2,
  Trophy,
  Phone,
  ArrowLeft,
  Heart,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/providers/AuthProvider";
import { getUserProfile, sendInterest, hasUserSentInterest } from "@/lib/firestore";
import { buildWhatsAppLink, formatExperience, getRatingTier, cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const uid = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasInterest, setHasInterest] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  const isOwnProfile = user?.uid === uid;

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!uid) return;
    getUserProfile(uid)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [uid]);

  useEffect(() => {
    if (!user || !uid || isOwnProfile) return;
    hasUserSentInterest(user.uid, uid).then(setHasInterest);
  }, [user, uid, isOwnProfile]);

  async function handleInterest() {
    if (!user || !profile) return;
    setInterestLoading(true);
    try {
      await sendInterest(user.uid, uid);
      setHasInterest(true);
    } finally {
      setInterestLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-navy flex items-center justify-center">
        <Navbar />
        <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-white font-semibold">Engineer not found</p>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
      </div>
    );
  }

  const tier = getRatingTier(profile.leetcodeRating);
  const waLink = buildWhatsAppLink(profile.whatsapp, profile.name);

  return (
    <div className="relative min-h-screen bg-navy">
      <div className="fixed inset-0 grid-pattern opacity-60 pointer-events-none" />
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Profile card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden">
            {/* Top glow bar */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />

            {/* Cover gradient */}
            <div className="h-32 bg-gradient-to-br from-neon-green/15 via-neon-cyan/10 to-neon-purple/15" />

            {/* Avatar + name */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ring-4 ring-navy overflow-hidden">
                    {profile.photo ? (
                      <Image
                        src={profile.photo}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-neon-green/30 to-cyan-500/30 flex items-center justify-center">
                        <span className="font-display font-bold text-3xl text-neon-green">
                          {profile.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-neon-green border-2 border-navy" />
                </div>

                {/* Action buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <Button
                      variant={hasInterest ? "secondary" : "neon"}
                      onClick={handleInterest}
                      disabled={hasInterest || interestLoading}
                    >
                      {interestLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className={cn("h-4 w-4", hasInterest && "fill-current")} />
                      )}
                      {hasInterest ? "Interest sent" : "Express Interest"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Name & basic info */}
              <div className="mb-5">
                <h1 className="font-display font-bold text-2xl text-white mb-1">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {profile.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Relocating to {profile.city}
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-sm text-slate-300 mt-3">{profile.bio}</p>
                )}
              </div>

              <Separator className="mb-5" />

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl bg-white/4 border border-white/8 p-4 text-center">
                  <Trophy className="h-5 w-5 text-yellow-400 mx-auto mb-1.5" />
                  <p className="font-mono text-xs text-slate-500 mb-0.5">LeetCode Rank</p>
                  <p className={cn("font-mono text-lg font-bold", tier.color)}>
                    {profile.leetcodeRating === 0
                      ? "Unrated"
                      : `#${profile.leetcodeRating.toLocaleString()}`}
                  </p>
                  <Badge
                    variant="yellow"
                    className="mt-1.5 text-[10px] mx-auto"
                  >
                    {tier.label}
                  </Badge>
                </div>

                <div className="rounded-xl bg-white/4 border border-white/8 p-4 text-center">
                  <Calendar className="h-5 w-5 text-neon-cyan mx-auto mb-1.5" />
                  <p className="font-mono text-xs text-slate-500 mb-0.5">Experience</p>
                  <p className="font-mono text-lg font-bold text-neon-cyan">
                    {formatExperience(profile.experience)}
                  </p>
                </div>

                <div className="rounded-xl bg-white/4 border border-white/8 p-4 text-center">
                  <Code2 className="h-5 w-5 text-neon-purple mx-auto mb-1.5" />
                  <p className="font-mono text-xs text-slate-500 mb-0.5">Tech Stack</p>
                  <p className="font-mono text-lg font-bold text-neon-purple">
                    {profile.techStack.length}
                  </p>
                </div>
              </div>

              {/* Tech stack */}
              {profile.techStack.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* LeetCode link */}
              {profile.leetcodeUsername && (
                <>
                  <Separator className="mb-5" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">LeetCode</p>
                      <p className="text-sm text-white font-mono">@{profile.leetcodeUsername}</p>
                    </div>
                    <a
                      href={`https://leetcode.com/${profile.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-neon-green hover:text-neon-green/80 transition-colors"
                    >
                      View profile
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </>
              )}

              {/* WhatsApp (only shown to matched users — for simplicity showing always for now) */}
              {!isOwnProfile && hasInterest && profile.whatsapp && (
                <>
                  <Separator className="my-5" />
                  <div>
                    <p className="text-xs text-slate-500 mb-3">Contact</p>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-all"
                    >
                      <Phone className="h-4 w-4" />
                      Chat on WhatsApp
                      <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-60" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
