"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  Code2,
  Briefcase,
  Phone,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/providers/AuthProvider";
import { createUserProfile } from "@/lib/firestore";
import { useProfile } from "@/hooks/useProfile";
import { verifyLeetCodeOwnership, getVerificationCode } from "@/lib/leetcode";
import {
  POPULAR_CITIES,
  POPULAR_COMPANIES,
  TECH_STACK_OPTIONS,
  ONBOARDING_STEPS,
} from "@/types";
import type { OnboardingStep } from "@/types";
import Link from "next/link";

const STEP_META: Record<
  OnboardingStep,
  { icon: React.ElementType; title: string; subtitle: string; color: string }
> = {
  city: {
    icon: MapPin,
    title: "Which city are you relocating to?",
    subtitle: "We'll match you with engineers in the same city.",
    color: "text-neon-green",
  },
  leetcode: {
    icon: Trophy,
    title: "What's your LeetCode username?",
    subtitle: "We auto-fetch your global ranking — no manual entry.",
    color: "text-yellow-400",
  },
  experience: {
    icon: Briefcase,
    title: "How many years of experience do you have?",
    subtitle: "We use this to match you with engineers at a similar stage.",
    color: "text-neon-cyan",
  },
  company: {
    icon: Code2,
    title: "Which company are you joining?",
    subtitle: "Optional — helps you find flatmates from the same org.",
    color: "text-neon-purple",
  },
  stack: {
    icon: Code2,
    title: "What's your tech stack?",
    subtitle: "Pick all that apply. Min 1, max 8.",
    color: "text-blue-400",
  },
  whatsapp: {
    icon: Phone,
    title: "Your WhatsApp number",
    subtitle: "Shared only with mutual matches. Include country code.",
    color: "text-green-400",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  const [step, setStep] = useState<OnboardingStep>("city");
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [submitError, setSubmitError] = useState<string>("");

  // Form state
  const [city, setCity] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [leetcodeRating, setLeetcodeRating] = useState<number | null>(null);
  // "idle" | "verifying" | "verified" | "error"
  const [lcVerifyState, setLcVerifyState] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const [lcVerifyError, setLcVerifyError] = useState("");
  const [experience, setExperience] = useState<string>("");
  const [company, setCompany] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { router.push("/login"); return; }
    if (profile) { router.push("/feed"); }
  }, [user, profile, authLoading, profileLoading, router]);

  const stepIndex = ONBOARDING_STEPS.indexOf(step);

  function goNext() {
    setDirection(1);
    const next = ONBOARDING_STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    setDirection(-1);
    const prev = ONBOARDING_STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  async function handleVerifyLeetCode() {
    if (!user || !leetcodeUsername.trim()) return;
    setLcVerifyState("verifying");
    setLcVerifyError("");
    setLeetcodeRating(null);
    try {
      const code = getVerificationCode(user.uid);
      const profile = await verifyLeetCodeOwnership(leetcodeUsername.trim(), code);
      setLeetcodeRating(profile.ranking);
      setLcVerifyState("verified");
    } catch (err) {
      setLcVerifyError(err instanceof Error ? err.message : "Verification failed");
      setLcVerifyState("error");
    }
  }

  function toggleStack(tech: string) {
    setTechStack((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : prev.length < 8
        ? [...prev, tech]
        : prev
    );
  }

  async function handleSubmit() {
    if (!user) return;

    // Check if online before attempting submission
    if (!navigator.onLine) {
      setSubmitError("You appear to be offline. Please check your internet connection and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      console.log("[Onboarding] Creating profile for user:", user.uid);

      await createUserProfile(user.uid, {
        name: user.displayName ?? "Engineer",
        email: user.email ?? "",
        photo: user.photoURL ?? "",
        city,
        leetcodeUsername,
        leetcodeRating: leetcodeRating ?? 0,
        experience: Number(experience),
        company,
        techStack,
        whatsapp,
      });

      console.log("[Onboarding] Profile created successfully, redirecting...");
      router.push("/feed");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create profile. Please try again.";
      console.error("[Onboarding] Profile creation failed:", errorMessage, err);
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  function canProceed(): boolean {
    switch (step) {
      case "city":        return !!city;
      case "leetcode":    return lcVerifyState === "verified" && leetcodeRating !== null;
      case "experience":  return !!experience;
      case "company":     return true; // optional
      case "stack":       return techStack.length > 0;
      case "whatsapp":    return whatsapp.length >= 8;
    }
  }

  const meta = STEP_META[step];
  const Icon = meta.icon;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <div className="relative min-h-screen bg-navy flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-100 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-cyan/5 blur-3xl pointer-events-none" />

      {/* Offline Banner */}
      {!navigator.onLine && (
        <div className="fixed top-16 left-4 right-4 z-50 rounded-lg bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3 animate-pulse">
          <span className="text-xl mt-0.5">📡</span>
          <div>
            <p className="font-medium text-red-400">You're offline</p>
            <p className="text-xs text-red-400/70">Check your internet connection to continue</p>
          </div>
        </div>
      )}

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

      <div className="w-full max-w-lg mt-16">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-mono">
              Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {Math.round(((stepIndex + 1) / ONBOARDING_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-neon-green"
              animate={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex gap-1 mt-3">
            {ONBOARDING_STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? "bg-neon-green" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />

          <div className="p-8">
            {/* Step header */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${meta.color}`} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-white leading-tight">
                      {meta.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{meta.subtitle}</p>
                  </div>
                </div>

                {/* Step-specific input */}
                <StepContent
                  step={step}
                  city={city} setCity={setCity}
                  leetcodeUsername={leetcodeUsername} setLeetcodeUsername={setLeetcodeUsername}
                  leetcodeRating={leetcodeRating}
                  lcVerifyState={lcVerifyState} lcVerifyError={lcVerifyError}
                  verifyCode={user ? getVerificationCode(user.uid) : ""}
                  onVerify={handleVerifyLeetCode}
                  onUsernameChange={() => { setLcVerifyState("idle"); setLeetcodeRating(null); }}
                  experience={experience} setExperience={setExperience}
                  company={company} setCompany={setCompany}
                  techStack={techStack} toggleStack={toggleStack}
                  whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-8 pb-8 pt-0 gap-4">
            {(submitError || profileError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-24 left-8 right-8 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">⚠</span>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{submitError || profileError}</p>
                    <p className="text-xs opacity-75">
                      {submitError?.includes("offline") || profileError?.includes("offline")
                        ? "Check your internet connection and try again."
                        : "If the problem persists after refreshing, contact support."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              variant="ghost"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {isLast ? (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canProceed() || submitting || !navigator.onLine}
                className="gap-2 flex-1 sm:flex-none"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {submitting ? "Creating profile..." : "Finish & find flatmates"}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={goNext}
                disabled={!canProceed()}
                className="gap-2 flex-1 sm:flex-none"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step content ──────────────────────────────────────────────────────
interface StepContentProps {
  step: OnboardingStep;
  city: string; setCity: (v: string) => void;
  leetcodeUsername: string; setLeetcodeUsername: (v: string) => void;
  leetcodeRating: number | null;
  lcVerifyState: "idle" | "verifying" | "verified" | "error";
  lcVerifyError: string;
  verifyCode: string;
  onVerify: () => void;
  onUsernameChange: () => void;
  experience: string; setExperience: (v: string) => void;
  company: string; setCompany: (v: string) => void;
  techStack: string[]; toggleStack: (t: string) => void;
  whatsapp: string; setWhatsapp: (v: string) => void;
}

function StepContent(props: StepContentProps) {
  const {
    step, city, setCity,
    leetcodeUsername, setLeetcodeUsername, leetcodeRating,
    lcVerifyState, lcVerifyError, verifyCode, onVerify, onUsernameChange,
    experience, setExperience,
    company, setCompany,
    techStack, toggleStack,
    whatsapp, setWhatsapp,
  } = props;

  if (step === "city") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {POPULAR_CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`rounded-xl border py-3 px-4 text-sm font-medium transition-all duration-200 text-left ${
              city === c
                ? "border-neon-green/60 bg-neon-green/10 text-neon-green"
                : "border-white/10 bg-white/3 text-slate-300 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <MapPin className="h-3.5 w-3.5 mb-1 opacity-60" />
            {c}
          </button>
        ))}
      </div>
    );
  }

  if (step === "leetcode") {
    const isVerified = lcVerifyState === "verified";
    const isVerifying = lcVerifyState === "verifying";

    return (
      <div className="space-y-4">
        {/* Step 1: username input */}
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2">
            Step 1 — Enter your LeetCode username
          </p>
          <Input
            placeholder="e.g. neal_wu"
            value={leetcodeUsername}
            onChange={(e) => {
              setLeetcodeUsername(e.target.value);
              onUsernameChange();
            }}
            disabled={isVerified}
          />
        </div>

        {/* Step 2: verification code — shown once username is typed */}
        {leetcodeUsername.trim() && !isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/5 p-4 space-y-3"
          >
            <p className="text-xs font-medium text-slate-300">
              Step 2 — Prove it&apos;s your account
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add the code below to your{" "}
              <span className="text-white font-medium">LeetCode profile bio</span>{" "}
              temporarily. You can remove it after verification.
            </p>

            {/* Copyable code */}
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-sm font-bold text-neon-cyan bg-black/30 rounded-lg px-3 py-2 tracking-wider">
                {verifyCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(verifyCode)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            {/* Link to LeetCode settings */}
            <a
              href={`https://leetcode.com/profile/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              Open LeetCode profile settings
              <ExternalLink className="h-3 w-3" />
            </a>

            <p className="text-xs text-slate-500">
              Step 3 — After saving your bio, click Verify below.
            </p>

            {/* Error */}
            {lcVerifyState === "error" && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <span>⚠</span> {lcVerifyError}
              </p>
            )}

            <Button
              size="sm"
              onClick={onVerify}
              disabled={isVerifying}
              className="w-full gap-2"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isVerifying ? "Checking your bio..." : "Verify ownership"}
            </Button>
          </motion.div>
        )}

        {/* Success */}
        {isVerified && leetcodeRating !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-neon-green/8 border border-neon-green/25 p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-neon-green text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Ownership verified — @{leetcodeUsername}
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Global Rank</p>
                <p className="font-mono font-bold text-2xl text-yellow-400">
                  #{leetcodeRating.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              You can now remove the code from your LeetCode bio.
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  if (step === "experience") {
    const options = [
      { label: "Fresher", value: "0" },
      { label: "1 year", value: "1" },
      { label: "2 years", value: "2" },
      { label: "3 years", value: "3" },
      { label: "4–5 years", value: "4" },
      { label: "6–8 years", value: "6" },
      { label: "9–10 years", value: "9" },
      { label: "10+ years", value: "11" },
    ];
    return (
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setExperience(value)}
            className={`rounded-xl border py-3 px-4 text-sm font-medium transition-all duration-200 text-left ${
              experience === value
                ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                : "border-white/10 bg-white/3 text-slate-300 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (step === "company") {
    return (
      <div className="space-y-4">
        <Select value={company} onValueChange={setCompany}>
          <SelectTrigger>
            <SelectValue placeholder="Select your company (optional)" />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_COMPANIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Or type a custom company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
    );
  }

  if (step === "stack") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {TECH_STACK_OPTIONS.map((tech) => {
            const selected = techStack.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleStack(tech)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selected
                    ? "border-neon-green/60 bg-neon-green/10 text-neon-green"
                    : "border-white/10 bg-white/3 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">
          {techStack.length}/8 selected
          {techStack.length === 8 && " (max reached)"}
        </p>
      </div>
    );
  }

  if (step === "whatsapp") {
    return (
      <div className="space-y-4">
        <Input
          label="WhatsApp number"
          placeholder="e.g. 919876543210"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
          hint="Include country code, no spaces or dashes. E.g. 919876543210 for India."
        />
        <div className="rounded-xl bg-green-500/6 border border-green-500/20 p-3 text-xs text-slate-400 flex gap-2">
          <span className="text-green-400 shrink-0">🔒</span>
          Your number is only shared when both you and the other person express interest.
          Mutual matches only.
        </div>
      </div>
    );
  }

  return null;
}
