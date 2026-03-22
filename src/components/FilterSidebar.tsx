"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { POPULAR_CITIES, POPULAR_COMPANIES, DEFAULT_FILTERS } from "@/types";
import type { FeedFilters } from "@/types";

interface FilterSidebarProps {
  filters: FeedFilters;
  onChange: (filters: FeedFilters) => void;
  onReset: () => void;
}

export default function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.city ||
    filters.company ||
    filters.minRating > 0 ||
    filters.maxRating < DEFAULT_FILTERS.maxRating ||
    filters.minExperience > 0 ||
    filters.maxExperience < DEFAULT_FILTERS.maxExperience;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neon-green" />
          <span className="font-semibold text-white text-sm">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-neon-green transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <Separator />

      {/* City */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
        <Select
          value={filters.city}
          onValueChange={(v) => onChange({ ...filters, city: v === "all" ? "" : v })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any city</SelectItem>
            {POPULAR_CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company</label>
        <Select
          value={filters.company}
          onValueChange={(v) => onChange({ ...filters, company: v === "all" ? "" : v })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any company</SelectItem>
            {POPULAR_COMPANIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Experience */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Experience</label>
          <span className="font-mono text-xs text-neon-green">
            {filters.minExperience}–{filters.maxExperience} yrs
          </span>
        </div>
        <Slider
          min={0}
          max={30}
          step={1}
          value={[filters.minExperience, filters.maxExperience]}
          onValueChange={([min, max]) =>
            onChange({ ...filters, minExperience: min, maxExperience: max })
          }
        />
      </div>

      {/* LeetCode Rating */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">LC Rank</label>
          <span className="font-mono text-xs text-cyan-400">
            #{filters.minRating.toLocaleString()}–#{filters.maxRating.toLocaleString()}
          </span>
        </div>
        <Slider
          min={0}
          max={500000}
          step={1000}
          value={[filters.minRating, filters.maxRating]}
          onValueChange={([min, max]) =>
            onChange({ ...filters, minRating: min, maxRating: max })
          }
        />
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</label>
            <div className="flex flex-wrap gap-1.5">
              {filters.city && (
                <Badge variant="cyan" className="text-[10px]">
                  📍 {filters.city}
                  <button onClick={() => onChange({ ...filters, city: "" })} className="ml-1.5 hover:text-white">
                    ×
                  </button>
                </Badge>
              )}
              {filters.company && (
                <Badge variant="purple" className="text-[10px]">
                  🏢 {filters.company}
                  <button onClick={() => onChange({ ...filters, company: "" })} className="ml-1.5 hover:text-white">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
