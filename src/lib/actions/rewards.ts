"use server";
import { createClient } from "../supabase/server";

export type Reward = {
  id: number;
  title: string;
  description: string;
  points: number;
  health: number;
  created_at: string;
};

export type UserReward = {
  user_id: number;
  reward_id: number;
  status: "AVAILABLE" | "COMPLETE" | "CLAIMED";
  created_at: string;
};

export async function getReward(rewardId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", rewardId)
    .single();

  if (error) throw error;
  return data as Reward;
}

export async function getAllRewards() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rewards").select("*");

  if (error) throw error;
  return data as Reward[];
}

export async function getUserRewards(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_rewards")
    .select(
      `
      *,
      rewards (*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data as (UserReward & { rewards: Reward })[];
}

export async function updateUserRewardStatus(
  userId: number,
  rewardId: number,
  status: UserReward["status"]
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_rewards")
    .update({ status })
    .eq("user_id", userId)
    .eq("reward_id", rewardId)
    .select()
    .single();

  if (error) throw error;
  return data as UserReward;
}

export async function createUserReward(
  userReward: Omit<UserReward, "created_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_rewards")
    .insert(userReward)
    .select()
    .single();

  if (error) throw error;
  return data as UserReward;
}
