"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, Code2, Heart, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatExperience, getRatingTier, truncate } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface EngineerCardProps {
  user: UserProfile;
  onInterest?: (uid: string) => void;
  hasInterest?: boolean;
  loading?: boolean;
  index?: number;
}

export default function EngineerCard({
  user,
  onInterest,
  hasInterest = false,
  loading = false,
  index = 0,
}: EngineerCardProps) {
  const tier = getRatingTier(user.leetcodeRating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-white/8 bg-gradient-to-b from-white/6 to-white/2 backdrop-blur-sm overflow-hidden cursor-pointer"
    >
      {/* Neon glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_rgba(0,255,148,0.08)_inset] pointer-events-none" />

      <Link href={`/user/${user.uid}`} className="block p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-neon-green/30 transition-all duration-300">
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-neon-green/20 to-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-neon-green">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-neon-green border-2 border-navy" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base leading-tight group-hover:text-neon-green transition-colors duration-200 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.company}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {user.city}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white/4 border border-white/6 p-2.5 text-center">
            <p className="font-mono text-xs text-slate-500 mb-0.5">LeetCode</p>
            <p className={cn("font-mono text-sm font-bold", tier.color)}>
              {user.leetcodeRating === 0 ? "—" : `#${user.leetcodeRating.toLocaleString()}`}
            </p>
          </div>
          <div className="rounded-lg bg-white/4 border border-white/6 p-2.5 text-center">
            <p className="font-mono text-xs text-slate-500 mb-0.5">Exp</p>
            <p className="font-mono text-sm font-bold text-cyan-400">
              {formatExperience(user.experience)}
            </p>
          </div>
          <div className="rounded-lg bg-white/4 border border-white/6 p-2.5 text-center">
            <p className="font-mono text-xs text-slate-500 mb-0.5">Stack</p>
            <p className="font-mono text-sm font-bold text-purple-400">
              {user.techStack.length}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        {user.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[10px] py-0.5">
                {tech}
              </Badge>
            ))}
            {user.techStack.length > 4 && (
              <Badge variant="secondary" className="text-[10px] py-0.5">
                +{user.techStack.length - 4}
              </Badge>
            )}
          </div>
        )}
      </Link>

      {/* Interest button */}
      {onInterest && (
        <div className="px-5 pb-5">
          <Button
            variant={hasInterest ? "secondary" : "neon"}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onInterest(user.uid);
            }}
            disabled={loading || hasInterest}
          >
            <Heart className={cn("h-3.5 w-3.5", hasInterest && "fill-current")} />
            {hasInterest ? "Interest Sent" : "Express Interest"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
