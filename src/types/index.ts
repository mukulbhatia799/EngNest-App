import { Timestamp } from "firebase/firestore";

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photo: string;
  city: string;
  leetcodeUsername: string;
  leetcodeRating: number;        // global ranking from LeetCode
  experience: number;            // years
  company: string;
  techStack: string[];
  whatsapp: string;              // phone number with country code, e.g. 919876543210
  bio?: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export type NewUserProfile = Omit<UserProfile, "uid" | "createdAt" | "updatedAt">;

// ─── Interests / Connections ──────────────────────────────────────────────────

export interface InterestDocument {
  sent: string[];      // userIds this user has sent interest to
  received: string[];  // userIds who have sent interest to this user
}

export interface Match {
  uid: string;
  name: string;
  photo: string;
  company: string;
  city: string;
  whatsapp: string;
  leetcodeRating: number;
  experience: number;
  techStack: string[];
}

// ─── LeetCode ────────────────────────────────────────────────────────────────

export interface LeetCodeProfile {
  ranking: number;
  username: string;
}

export interface LeetCodeAPIResponse {
  data: {
    matchedUser: {
      profile: {
        ranking: number;
        aboutMe: string | null;
      };
    } | null;
  };
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface FeedFilters {
  city: string;
  minRating: number;
  maxRating: number;
  minExperience: number;
  maxExperience: number;
  company: string;
  techStack: string[];
}

export const DEFAULT_FILTERS: FeedFilters = {
  city: "",
  minRating: 0,
  maxRating: 500000,
  minExperience: 0,
  maxExperience: 30,
  company: "",
  techStack: [],
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export type OnboardingStep = "city" | "leetcode" | "experience" | "company" | "stack" | "whatsapp";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "city",
  "leetcode",
  "experience",
  "company",
  "stack",
  "whatsapp",
];

export const POPULAR_CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Gurgaon",
  "Noida",
];

export const POPULAR_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Flipkart",
  "Swiggy",
  "Zomato",
  "Razorpay",
  "CRED",
  "Zepto",
  "Meesho",
  "PhonePe",
  "Paytm",
  "Startup",
  "Other",
];

export const TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Spring Boot",
  "TypeScript",
  "GraphQL",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Flutter",
  "React Native",
  "C++",
  "Machine Learning",
  "Data Science",
  "DevOps",
];
