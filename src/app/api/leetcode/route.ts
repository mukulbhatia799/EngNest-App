import { NextRequest, NextResponse } from "next/server";
import type { LeetCodeAPIResponse, LeetCodeProfile } from "@/types";

const LEETCODE_GQL = "https://leetcode.com/graphql";

// Inline query — avoids CSRF requirement that parameterized queries trigger.
// Username is validated with /^[a-zA-Z0-9_-]+$/ before use, so inlining is safe.
function buildQuery(username: string) {
  return `{ matchedUser(username: "${username}") { profile { ranking aboutMe } } }`;
}

// Fetch a real LeetCode session so their API serves live (non-cached) bio data.
async function getLeetCodeSession(): Promise<{ cookies: string; csrfToken: string }> {
  try {
    const res = await fetch("https://leetcode.com/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    const rawCookies = res.headers.get("set-cookie") ?? "";
    const csrfMatch = rawCookies.match(/csrftoken=([^;,\s]+)/);
    return { cookies: rawCookies, csrfToken: csrfMatch?.[1] ?? "" };
  } catch {
    return { cookies: "", csrfToken: "" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, verifyCode } = body as { username: string; verifyCode?: string };

    if (!username || typeof username !== "string") {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }

    const trimmed = username.trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return NextResponse.json({ message: "Invalid LeetCode username" }, { status: 400 });
    }

    // Always get a fresh session so LeetCode returns live bio data (not cached).
    const { cookies, csrfToken } = await getLeetCodeSession();

    const response = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer":       "https://leetcode.com",
        "Origin":        "https://leetcode.com",
        "Cookie":        cookies,
        "x-csrftoken":   csrfToken,
      },
      body: JSON.stringify({ query: buildQuery(trimmed) }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "LeetCode API unavailable" },
        { status: 502 }
      );
    }

    const data: LeetCodeAPIResponse = await response.json();

    if (!data.data?.matchedUser) {
      return NextResponse.json(
        { message: `LeetCode user "${trimmed}" not found` },
        { status: 404 }
      );
    }

    const { ranking, aboutMe } = data.data.matchedUser.profile;

    // Ownership verification mode: check bio contains the expected code
    if (verifyCode) {
      const bio = aboutMe ?? "";
      if (!bio.includes(verifyCode)) {
        return NextResponse.json(
          {
            message:
              "Verification code not found in your LeetCode bio. " +
              "If you just saved it, wait 30 seconds and try again — LeetCode can take a moment to update.",
          },
          { status: 403 }
        );
      }
    }

    const profile: LeetCodeProfile = {
      username: trimmed,
      ranking: ranking ?? 0,
    };

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
