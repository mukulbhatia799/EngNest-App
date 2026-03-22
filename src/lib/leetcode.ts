import type { LeetCodeProfile } from "@/types";

async function callLeetCodeAPI(
  username: string,
  verifyCode?: string
): Promise<LeetCodeProfile> {
  const res = await fetch("/api/leetcode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, verifyCode }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch LeetCode profile");
  }

  return res.json();
}

// Check the account exists and return its ranking (no ownership check)
export async function fetchLeetCodeRating(username: string): Promise<LeetCodeProfile> {
  return callLeetCodeAPI(username);
}

// Verify the account belongs to this user by checking their bio contains the code,
// then return the confirmed ranking.
export async function verifyLeetCodeOwnership(
  username: string,
  verifyCode: string
): Promise<LeetCodeProfile> {
  return callLeetCodeAPI(username, verifyCode);
}

// Generates a deterministic, human-readable verification code from a Firebase UID
export function getVerificationCode(uid: string): string {
  return `ENGNEST-${uid.slice(0, 8).toUpperCase()}`;
}
