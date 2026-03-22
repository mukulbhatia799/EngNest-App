"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  Code2,
  Users,
  ArrowRight,
  Github,
  Star,
  Trophy,
  Briefcase,
  CheckCircle2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Typing animation hook ────────────────────────────────────────────
function useTypingEffect(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ─── Mock data ───────────────────────────────────────────────────────
const MOCK_ENGINEER = {
  name: "Priya Sharma",
  company: "Google",
  city: "Bangalore",
  leetcodeRating: 423,
  experience: 4,
  techStack: ["Go", "React", "Kubernetes", "GCP"],
  initials: "PS",
};

const STATS = [
  { label: "Engineers matched", value: "200+", icon: Users },
  { label: "Cities covered", value: "12+", icon: MapPin },
  { label: "LeetCode verified", value: "100%", icon: Trophy },
  { label: "Mutual matches", value: "80+", icon: Heart },
];

const STEPS = [
  {
    step: "01",
    icon: Github,
    title: "Sign in with Google",
    desc: "One click. No passwords. Your Google account is all you need.",
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    border: "border-neon-green/20",
  },
  {
    step: "02",
    icon: Code2,
    title: "Set up your profile",
    desc: "Enter your LeetCode username — we auto-fetch your global ranking. Add city, company, and tech stack.",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
    border: "border-neon-cyan/20",
  },
  {
    step: "03",
    icon: Users,
    title: "Browse & connect",
    desc: "Swipe through engineer profiles filtered by rating, experience, and city. Express interest.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
    border: "border-neon-purple/20",
  },
  {
    step: "04",
    icon: MessageCircle,
    title: "Mutual match → WhatsApp",
    desc: "When both of you express interest, you get a direct WhatsApp link to connect instantly.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
];

// ─── Landing page ────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const typingWord = useTypingEffect([
    "Bangalore",
    "Mumbai",
    "Hyderabad",
    "Gurgaon",
    "Pune",
    "Delhi",
  ]);

  return (
    <div className="relative min-h-screen bg-navy overflow-x-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 grid-pattern opacity-100 pointer-events-none" />
      <div className="fixed inset-0 spotlight pointer-events-none" />
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full bg-neon-green/5 blur-3xl pointer-events-none" />
      <div className="fixed top-40 right-1/4 w-80 h-80 rounded-full bg-neon-cyan/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/3 w-64 h-64 rounded-full bg-neon-purple/5 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-navy/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-green/15 border border-neon-green/30">
              <Zap className="h-4 w-4 text-neon-green" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              Eng<span className="text-neon-green">Nest</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Button size="sm" asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-neon-green/8 px-4 py-1.5 text-xs font-medium text-neon-green mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
            LeetCode-verified engineer matching
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-5xl"
        >
          <span className="text-white">Find your engineer</span>
          <br />
          <span className="gradient-text">flatmate in</span>{" "}
          <span className="text-white">
            <span className="gradient-text-green">{typingWord}</span>
            <span className="animate-blink text-neon-green ml-0.5">|</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Match with engineers relocating to the same city — filtered by{" "}
          <span className="text-neon-green font-medium">LeetCode ranking</span>,{" "}
          <span className="text-neon-cyan font-medium">years of experience</span>, company, and
          tech stack. No more generic flatmate listings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="xl" asChild className="glow-green w-full sm:w-auto">
            <Link href="/login">
              <Zap className="h-5 w-5" />
              Find my flatmate
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild className="w-full sm:w-auto">
            <Link href="#how-it-works">
              How it works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Social proof avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex items-center gap-4 text-sm text-slate-500"
        >
          <div className="flex -space-x-2">
            {["A", "B", "C", "D", "E"].map((l, i) => (
              <div
                key={l}
                className="h-8 w-8 rounded-full border-2 border-navy flex items-center justify-center text-xs font-bold"
                style={{
                  background: `hsl(${i * 60 + 140}, 70%, 25%)`,
                  color: `hsl(${i * 60 + 140}, 100%, 80%)`,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <span>200+ engineers already on EngNest</span>
        </motion.div>

        {/* Hero cards */}
        <div className="mt-20 w-full max-w-5xl relative">
          {/* Floating code */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden lg:block absolute -left-8 top-4 w-80 animate-float-slow"
          >
            <div className="glass rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-neon-green" />
                <span className="text-xs text-slate-500 ml-2 font-mono">match.ts</span>
              </div>
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <span className="text-neon-cyan">const</span>{" "}
                <span className="text-white">match</span>{" = "}
                <span className="text-neon-green">engineers</span>
                {".find(\n  eng =>\n  eng.city === "}
                <span className="text-yellow-400">&quot;Bangalore&quot;</span>
                {"\n  && eng.leetcode"}
                {"\n  < "}
                <span className="text-neon-cyan">1000</span>
                {"\n);\n\n"}
                <span className="text-slate-500">{"// ✓ Priya — Google"}</span>
              </pre>
            </div>
          </motion.div>

          {/* Center card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mx-auto max-w-sm"
          >
            <PreviewCard />
          </motion.div>

          {/* Match badge */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden lg:block absolute -right-8 top-8 animate-float"
          >
            <div className="glass rounded-xl p-4 w-56">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-neon-green fill-current" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">It&apos;s a Match!</p>
                  <p className="text-[10px] text-slate-400">Mutual interest 🎉</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/20 border border-green-500/30 py-2 text-xs font-medium text-green-400">
                <MessageCircle className="h-3.5 w-3.5" />
                Open WhatsApp
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-4 rounded-full border border-white/20 flex items-start justify-center pt-1"
          >
            <div className="h-1.5 w-1 rounded-full bg-neon-green" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-white/6 bg-white/2 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="h-10 w-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-neon-green" />
                </div>
                <p className="font-display font-bold text-2xl text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              From signup to{" "}
              <span className="gradient-text">WhatsApp chat</span>
              <br />in 4 steps
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We built the fastest path from &quot;I need a flatmate&quot; to &quot;Found one&quot;.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, icon: Icon, title, desc, color, bg, border }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border ${border} bg-white/3 backdrop-blur-sm p-6`}
              >
                <div className="absolute top-4 right-4 font-mono text-xs text-slate-600 font-bold">
                  {step}
                </div>
                <div className={`h-12 w-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-5`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-display font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineer card showcase */}
      <section className="relative z-10 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="cyan" className="mb-4">Profile cards</Badge>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
                Every card shows what{" "}
                <span className="gradient-text">actually matters</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Trophy, text: "LeetCode global ranking — verified live", color: "text-yellow-400" },
                  { icon: Briefcase, text: "Current company and years of experience", color: "text-neon-cyan" },
                  { icon: Code2, text: "Full tech stack at a glance", color: "text-neon-green" },
                  { icon: MapPin, text: "City they're relocating to", color: "text-neon-purple" },
                  { icon: MessageCircle, text: "Instant WhatsApp connect on mutual match", color: "text-green-400" },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
                    <p className="text-slate-300 text-sm">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Start browsing engineers
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm">
                <PreviewCard interactive />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-neon-green/20 bg-gradient-to-b from-neon-green/8 to-transparent p-12 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-green/15 border border-neon-green/30 mb-6">
              <Zap className="h-8 w-8 text-neon-green" />
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Ready to find your{" "}
              <span className="gradient-text-green">perfect engineer flatmate?</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Join engineers relocating across India. Sign up in 30 seconds.
            </p>
            <Button size="xl" asChild className="glow-green">
              <Link href="/login">
                <Zap className="h-5 w-5" />
                Get started — it&apos;s free
              </Link>
            </Button>
            <p className="mt-4 text-xs text-slate-500">
              No credit card required. Google Sign-In only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6 py-8 px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-neon-green" />
            <span className="font-display font-semibold text-white">
              Eng<span className="text-neon-green">Nest</span>
            </span>
            <span>— Built for engineers, by engineers.</span>
          </div>
          <p>© 2026 EngNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Preview Card ─────────────────────────────────────────────────────
function PreviewCard({ interactive = false }: { interactive?: boolean }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={interactive ? { y: -6 } : {}}
      className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/2 backdrop-blur-md overflow-hidden p-5 shadow-2xl"
    >
      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-neon-green/30 to-cyan-500/30 border border-white/10 flex items-center justify-center">
            <span className="font-display font-bold text-2xl text-neon-green">
              {MOCK_ENGINEER.initials}
            </span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-neon-green border-2 border-navy animate-pulse-ring" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-white text-base">{MOCK_ENGINEER.name}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Briefcase className="h-3.5 w-3.5" />
            {MOCK_ENGINEER.company}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-3 w-3" />
            {MOCK_ENGINEER.city}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-black/20 border border-white/6 p-2.5 text-center">
          <p className="font-mono text-[10px] text-slate-500 mb-0.5">LeetCode</p>
          <p className="font-mono text-sm font-bold text-yellow-400">
            #{MOCK_ENGINEER.leetcodeRating}
          </p>
        </div>
        <div className="rounded-lg bg-black/20 border border-white/6 p-2.5 text-center">
          <p className="font-mono text-[10px] text-slate-500 mb-0.5">Exp</p>
          <p className="font-mono text-sm font-bold text-neon-cyan">
            {MOCK_ENGINEER.experience} yrs
          </p>
        </div>
        <div className="rounded-lg bg-black/20 border border-white/6 p-2.5 text-center">
          <p className="font-mono text-[10px] text-slate-500 mb-0.5">Stack</p>
          <p className="font-mono text-sm font-bold text-neon-purple">
            {MOCK_ENGINEER.techStack.length}
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {MOCK_ENGINEER.techStack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-medium bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action */}
      {interactive ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLiked(!liked)}
          className={`mt-4 w-full rounded-xl border py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
            liked
              ? "bg-neon-green/15 border-neon-green/40 text-neon-green"
              : "bg-transparent border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "Interest sent!" : "Express Interest"}
        </motion.button>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-neon-green/10 border border-neon-green/30 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
          <span className="text-sm font-medium text-neon-green">LeetCode verified</span>
        </div>
      )}
    </motion.div>
  );
}
