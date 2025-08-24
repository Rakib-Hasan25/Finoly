import { createClient } from "@/lib/supabase/server";

export async function getCourses() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }

  return courses;
}

export async function getCourseById(courseId: string) {
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      levels (*)
    `
    )
    .eq("id", courseId)
    .single();

  if (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }

  return course;
}

export async function createCourse(data: {
  title: string;
  description: string;
  image_url?: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
}) {
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  return course;
}

export async function updateCourse(
  courseId: string,
  data: Partial<{
    title: string;
    description: string;
    image_url: string;
    difficulty_level: "beginner" | "intermediate" | "advanced";
  }>
) {
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .update(data)
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating course ${courseId}:`, error);
    throw error;
  }

  return course;
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    throw error;
  }
}
