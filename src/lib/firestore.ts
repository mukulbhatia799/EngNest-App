import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  arrayUnion,
  serverTimestamp,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, NewUserProfile, InterestDocument, Match } from "@/types";

// ─── Error handling ────────────────────────────────────────────────────────────────

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("offline")) {
      return "No internet connection. Please check your network and try again.";
    }
    if (err.message.includes("Permission denied")) {
      return "Permission denied. Your security rules may be blocking this operation.";
    }
    return err.message;
  }
  return "An unexpected error occurred";
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { uid, ...snap.data() } as UserProfile;
  } catch (err) {
    console.error("[Firestore] getUserProfile failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

export async function createUserProfile(
  uid: string,
  profile: NewUserProfile
): Promise<void> {
  try {
    const ref = doc(db, "users", uid);
    await setDoc(ref, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[Firestore] createUserProfile failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<NewUserProfile>
): Promise<void> {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  } catch (err) {
    console.error("[Firestore] updateUserProfile failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

// ─── Feed / Browse ────────────────────────────────────────────────────────────

export async function getAllUsers(excludeUid: string): Promise<UserProfile[]> {
  try {
    const ref = collection(db, "users");
    const q = query(ref, limit(100));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
      .filter((u) => u.uid !== excludeUid);
  } catch (err) {
    console.error("[Firestore] getAllUsers failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

export async function getUsersByCity(city: string, excludeUid: string): Promise<UserProfile[]> {
  try {
    const ref = collection(db, "users");
    const q = query(ref, where("city", "==", city), limit(50));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
      .filter((u) => u.uid !== excludeUid);
  } catch (err) {
    console.error("[Firestore] getUsersByCity failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

// ─── Interests ────────────────────────────────────────────────────────────────

export async function getInterests(uid: string): Promise<InterestDocument> {
  try {
    const ref = doc(db, "interests", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { sent: [], received: [] };
    return snap.data() as InterestDocument;
  } catch (err) {
    console.error("[Firestore] getInterests failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

export async function sendInterest(fromUid: string, toUid: string): Promise<void> {
  try {
    // Add toUid to sender's sent list
    const senderRef = doc(db, "interests", fromUid);
    const senderSnap = await getDoc(senderRef);
    if (!senderSnap.exists()) {
      await setDoc(senderRef, { sent: [toUid], received: [] });
    } else {
      await updateDoc(senderRef, { sent: arrayUnion(toUid) });
    }

    // Add fromUid to receiver's received list
    const receiverRef = doc(db, "interests", toUid);
    const receiverSnap = await getDoc(receiverRef);
    if (!receiverSnap.exists()) {
      await setDoc(receiverRef, { sent: [], received: [fromUid] });
    } else {
      await updateDoc(receiverRef, { received: arrayUnion(fromUid) });
    }
  } catch (err) {
    console.error("[Firestore] sendInterest failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export async function getMutualMatches(uid: string): Promise<Match[]> {
  try {
    const interests = await getInterests(uid);
    const { sent, received } = interests;

    // Mutual = sent interest AND received interest from same person
    const mutualUids = sent.filter((id) => received.includes(id));

    if (mutualUids.length === 0) return [];

    const profiles = await Promise.all(mutualUids.map((id) => getUserProfile(id)));
    return profiles
      .filter(Boolean)
      .map((p) => ({
        uid: p!.uid,
        name: p!.name,
        photo: p!.photo,
        company: p!.company,
        city: p!.city,
        whatsapp: p!.whatsapp,
        leetcodeRating: p!.leetcodeRating,
        experience: p!.experience,
        techStack: p!.techStack,
      })) as Match[];
  } catch (err) {
    console.error("[Firestore] getMutualMatches failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

export async function hasUserSentInterest(fromUid: string, toUid: string): Promise<boolean> {
  try {
    const interests = await getInterests(fromUid);
    return interests.sent.includes(toUid);
  } catch (err) {
    console.error("[Firestore] hasUserSentInterest failed:", err);
    throw new Error(getErrorMessage(err));
  }
}

