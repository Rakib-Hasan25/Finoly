"use server";
import { createClient } from "@/lib/supabase/server";

export async function getLevels(courseId: string) {
  const supabase = await createClient();

  const { data: levels, error } = await supabase
    .from("levels")
    .select("*")
    .eq("course_id", courseId)
    .order("level_no", { ascending: true });

  if (error) {
    console.error(`Error fetching levels for course ${courseId}:`, error);
    throw error;
  }

  return levels;
}

export async function getLevelById(levelId: string) {
  const supabase = await createClient();

  const { data: level, error } = await supabase
    .from("levels")
    .select("*")
    .eq("id", levelId)
    .single();

  if (error) {
    console.error(`Error fetching level ${levelId}:`, error);
    throw error;
  }

  return level;
}

export async function createLevel(data: {
  title: string;
  description: string;
  course_id: string;
  order: number;
  points_required?: number;
}) {
  const supabase = await createClient();

  const { data: level, error } = await supabase
    .from("levels")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating level:", error);
    throw error;
  }

  return level;
}

export async function updateLevel(
  levelId: string,
  data: Partial<{
    title: string;
    description: string;
    order: number;
    points_required: number;
  }>
) {
  const supabase = await createClient();

  const { data: level, error } = await supabase
    .from("levels")
    .update(data)
    .eq("id", levelId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating level ${levelId}:`, error);
    throw error;
  }

  return level;
}

export async function deleteLevel(levelId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("levels").delete().eq("id", levelId);

  if (error) {
    console.error(`Error deleting level ${levelId}:`, error);
    throw error;
  }
}
