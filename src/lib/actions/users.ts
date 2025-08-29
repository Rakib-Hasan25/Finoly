"use server";
import { createClient } from "../supabase/server";

export type User = {
  id: number;
  email: string;
  name: string;
  points: number;
  badge: string;
  xp: number;
  health: number;
  created_at: string;
  updated_at: string;
};

export async function getUser(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(userId: number, updates: Partial<User>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data as User;
}

export interface Player {
  id: number;
  rank: string;
  name: string;
  score: number;
}

export async function getLeaderboard(currentUserId: number): Promise<Player[]> {
 const supabase = await createClient();

 // Helper to get name from email if name is empty
 const getName = (name: string | null, email: string) =>
  name && name.trim() !== "" ? name : email.split("@")[0];

 // 1. Fetch top 3 users by xp, tie-breaker: created_at
 const { data: topUsers } = await supabase
  .from("users")
  .select("id, name, email, xp, created_at")
  .order("xp", { ascending: false })
  .order("created_at", { ascending: true })
  .limit(3);

 if (!topUsers) return [];

 let leaderboard: Player[] = topUsers.map((u, index) => ({
  id: u.id,
  rank: `${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "rd"}`,
  name: getName(u.name, u.email),
  score: u.xp,
 }));

 // 2. Add current user if not in top 3
 if (!topUsers.find((u) => u.id === currentUserId)) {
  const { data: currentUser } = await supabase
   .from("users")
   .select("id, name, email, xp, created_at")
   .eq("id", currentUserId)
   .single();

  if (currentUser) {
   const { data: higherXpUsers } = await supabase
    .from("users")
    .select("id")
    .or(`xp.gt.${currentUser.xp},xp.eq.${currentUser.xp},created_at.lt.${currentUser.created_at}`); // tie-breaker

   const position = higherXpUsers ? higherXpUsers.length + 1 : 4;
   leaderboard.push({
    id: currentUser.id,
    rank: `${position}th`,
    name: getName(currentUser.name, currentUser.email),
    score: currentUser.xp,
   });
  }
 }

 return leaderboard;
}

