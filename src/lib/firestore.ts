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
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, NewUserProfile, InterestDocument, Match } from "@/types";

// ─── User CRUD ────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as UserProfile;
}

export async function createUserProfile(
  uid: string,
  profile: NewUserProfile
): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<NewUserProfile>
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

// ─── Feed / Browse ────────────────────────────────────────────────────────────

export async function getAllUsers(excludeUid: string): Promise<UserProfile[]> {
  const ref = collection(db, "users");
  const q = query(ref, orderBy("createdAt", "desc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
    .filter((u) => u.uid !== excludeUid);
}

export async function getUsersByCity(city: string, excludeUid: string): Promise<UserProfile[]> {
  const ref = collection(db, "users");
  const q = query(ref, where("city", "==", city), orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ uid: d.id, ...d.data() } as UserProfile))
    .filter((u) => u.uid !== excludeUid);
}

// ─── Interests ────────────────────────────────────────────────────────────────

export async function getInterests(uid: string): Promise<InterestDocument> {
  const ref = doc(db, "interests", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { sent: [], received: [] };
  return snap.data() as InterestDocument;
}

export async function sendInterest(fromUid: string, toUid: string): Promise<void> {
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
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export async function getMutualMatches(uid: string): Promise<Match[]> {
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
}

export async function hasUserSentInterest(fromUid: string, toUid: string): Promise<boolean> {
  const interests = await getInterests(fromUid);
  return interests.sent.includes(toUid);
}
