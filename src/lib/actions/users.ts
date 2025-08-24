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
