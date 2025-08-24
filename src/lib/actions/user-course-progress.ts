"use server";
import { createClient } from "../supabase/server";

export type UserCourseProgress = {
  user_id: number;
  course_id: number;
  status: "not_started" | "in_progress" | "completed";
  progression: number;
  completion_percentage: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserCourseProgress(userId: number, courseId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error) throw error;
  return data as UserCourseProgress;
}

export async function updateUserCourseProgress(
  userId: number,
  courseId: number,
  updates: Partial<UserCourseProgress>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .update(updates)
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .select()
    .single();

  if (error) throw error;
  return data as UserCourseProgress;
}

export async function createUserCourseProgress(
  progress: Omit<UserCourseProgress, "created_at" | "updated_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .insert(progress)
    .select()
    .single();

  if (error) throw error;
  return data as UserCourseProgress;
}
