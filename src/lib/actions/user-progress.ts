"use server";
import { createClient } from "@/lib/supabase/client";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

// Course Progress Functions
export async function getUserCourseProgress(userId: string, courseId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserCourseProgress(
  userId: string,
  courseId: string,
  data: {
    status?: ProgressStatus;
    completion_percentage?: number;
    completed_at?: Date | null;
  }
) {
  const supabase = createClient();
  const updates = {
    user_id: userId,
    course_id: courseId,
    status: data.status || "not_started",
    completion_percentage: data.completion_percentage || 0,
    started_at: data.status === "not_started" ? null : new Date().toISOString(),
    completed_at: data.completed_at?.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("user_course_progress")
    .upsert(updates)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// Level Progress Functions
export async function getUserLevelProgress(userId: string, levelId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_level_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserLevelProgress(
  userId: string,
  levelId: string,
  data: {
    status?: ProgressStatus;
    score?: number;
    attempts?: number;
    completed_at?: Date | null;
  }
) {
  const supabase = createClient();
  const updates = {
    user_id: userId,
    level_id: levelId,
    status: data.status || "not_started",
    score: data.score || 0,
    attempts: (data.attempts ?? 0) + 1,
    completed_at: data.completed_at?.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("user_level_progress")
    .upsert(updates)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// Progress List Functions
export async function getUserCourseProgressList(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_course_progress")
    .select(
      `
      *,
      course:courses (*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function getUserLevelProgressList(
  userId: string,
  courseId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_level_progress")
    .select(
      `
      *,
      level:levels (*)
    `
    )
    .eq("user_id", userId)
    .eq("level.course_id", courseId);

  if (error) throw error;
  return data;
}
