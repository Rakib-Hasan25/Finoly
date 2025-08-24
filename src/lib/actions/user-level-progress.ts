"use server";
import { createClient } from "../supabase/server";

export type UserLevelProgress = {
  id: number;
  user_id: number;
  level_id: number;
  status: "not_started" | "in_progress" | "completed";
  progression: number;
  score: number;
  attempts: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserLevelProgress(userId: number, levelId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_level_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .single();

  if (error) throw error;
  return data as UserLevelProgress;
}

export async function updateUserLevelProgress(
  userId: number,
  levelId: number,
  updates: Partial<UserLevelProgress>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_level_progress")
    .update(updates)
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .select()
    .single();

  if (error) throw error;
  return data as UserLevelProgress;
}

export async function createUserLevelProgress(
  progress: Omit<UserLevelProgress, "id" | "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_level_progress")
    .insert(progress)
    .select()
    .single();

  if (error) throw error;
  return data as UserLevelProgress;
}
