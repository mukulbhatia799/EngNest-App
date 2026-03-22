import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  if (rating === 0) return "Unrated";
  if (rating <= 1000) return `Top ${rating}`;
  return rating.toLocaleString("en-IN");
}

export function formatExperience(years: number): string {
  if (years === 0) return "Fresher";
  if (years === 1) return "1 yr";
  return `${years} yrs`;
}

export function getRatingTier(rating: number): { label: string; color: string } {
  if (rating === 0) return { label: "Unrated", color: "text-slate-400" };
  if (rating <= 500) return { label: "Guardian", color: "text-yellow-400" };
  if (rating <= 2500) return { label: "Knight", color: "text-purple-400" };
  if (rating <= 10000) return { label: "Expert", color: "text-blue-400" };
  if (rating <= 50000) return { label: "Active", color: "text-green-400" };
  return { label: "Beginner", color: "text-slate-400" };
}

export function buildWhatsAppLink(phone: string, name: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hi ${name}! I found you on EngNest and I think we could be great flatmates. Let's connect!`
  );
  return `https://wa.me/${cleaned}?text=${message}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}
