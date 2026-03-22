"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Loader2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import EngineerCard from "@/components/EngineerCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/providers/AuthProvider";
import { getAllUsers, sendInterest, hasUserSentInterest } from "@/lib/firestore";
import { DEFAULT_FILTERS } from "@/types";
import type { UserProfile, FeedFilters } from "@/types";

export default function FeedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();

  const [engineers, setEngineers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [interests, setInterests] = useState<Record<string, boolean>>({});
  const [interestLoading, setInterestLoading] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAllUsers(user.uid)
      .then(async (users) => {
        setEngineers(users);
        const interestChecks = await Promise.all(
          users.map(async (u) => ({
            uid: u.uid,
            sent: await hasUserSentInterest(user.uid, u.uid),
          }))
        );
        const map: Record<string, boolean> = {};
        interestChecks.forEach(({ uid, sent }) => { map[uid] = sent; });
        setInterests(map);
      })
      .catch((err) => console.error("getAllUsers failed:", err))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleInterest(targetUid: string) {
    if (!user) return;
    setInterestLoading((prev) => ({ ...prev, [targetUid]: true }));
    try {
      await sendInterest(user.uid, targetUid);
      setInterests((prev) => ({ ...prev, [targetUid]: true }));
    } finally {
      setInterestLoading((prev) => ({ ...prev, [targetUid]: false }));
    }
  }

  const filtered = useMemo(() => {
    return engineers.filter((eng) => {
      if (filters.city && eng.city !== filters.city) return false;
      if (filters.company && eng.company !== filters.company) return false;
      if (eng.experience < filters.minExperience || eng.experience > filters.maxExperience) return false;
      if (eng.leetcodeRating !== 0) {
        if (eng.leetcodeRating < filters.minRating || eng.leetcodeRating > filters.maxRating) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          eng.name.toLowerCase().includes(q) ||
          eng.company.toLowerCase().includes(q) ||
          eng.city.toLowerCase().includes(q) ||
          eng.techStack.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [engineers, filters, search]);

  return (
    <div className="relative min-h-screen bg-navy">
      <div className="fixed inset-0 grid-pattern opacity-60 pointer-events-none" />
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Browse Engineers
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {loading ? "Loading..." : `${filtered.length} engineers found`}
              </p>
            </div>

            {/* Search + filter toggle */}
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-72 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, company, tech..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 transition-all"
                />
              </div>
              <Button
                variant={showFilters ? "outline" : "ghost"}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>

          {/* Cards grid */}
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
                <p className="text-slate-400 text-sm">Finding engineers near you...</p>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 gap-4 text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-white font-semibold">No engineers found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Try adjusting your filters or search query
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setSearch("");
                }}>
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((eng, i) => (
                  <EngineerCard
                    key={eng.uid}
                    user={eng}
                    onInterest={handleInterest}
                    hasInterest={interests[eng.uid] ?? false}
                    loading={interestLoading[eng.uid] ?? false}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
