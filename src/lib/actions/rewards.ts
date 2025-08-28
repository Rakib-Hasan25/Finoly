"use server";
import { progress } from "framer-motion";
import { createClient } from "../supabase/server";

export type Reward = {
  id: number;
  title: string;
  description: string;
  type: string;
  points: number;
  health: number;
  badge: string | null;
  requirements: number;
  created_at: string;
};

export type UserReward = {
  user_id: number;
  reward_id: number;
  progress: number;
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


export async function syncUserRewards(userId: number) {
  // 1. Get all rewards
  const supabase = await createClient();
  const { data: rewards, error: rewardError } = await supabase
    .from("rewards")
    .select("id, title, description, points, health, badge, requirements")
    .eq("type", "daily");

  if (rewardError) throw rewardError;

  // 2. Get user existing rewards
  const { data: userRewards, error: userRewardError } = await supabase
    .from("user_rewards")
    .select("reward_id, status")
    .eq("user_id", userId);

  if (userRewardError) throw userRewardError;

  // 3. Find missing rewards
  const existingIds = new Set(userRewards.map((ur) => ur.reward_id));
  const missingRewards = rewards.filter((r) => !existingIds.has(r.id));

  // 4. Insert missing rewards with status = incomplete
  if (missingRewards.length > 0) {
    const inserts = missingRewards.map((r) => ({
      user_id: userId,
      reward_id: r.id,
      status: "AVAILABLE",
      progress : 0
    }));

    const { error: insertError } = await supabase
      .from("user_rewards")
      .insert(inserts);

    if (insertError) throw insertError;
  }

  // 5. Fetch joined data: reward + user_reward.status
  const { data: finalData, error: finalError } = await supabase
    .from("user_rewards")
    .select(`
      status,
      user_id,
      reward_id,
      reward:reward_id (
        title,
        description,
        points,
        health,
        badge,
        requirements
      )
    `)
    .eq("user_id", userId);

  if (finalError) throw finalError;

  // 6. Flatten reward + status into single object
  const response = finalData.map((row) => ({
    ...row.reward,
    status: row.status,
    userID : row.user_id,
    rewardID : row.reward_id
  }));

  return response;
}



type RewardType = "points" | "health";

export async function updateCompletedRewards(userId: number, type: RewardType) {
 const supabase = await createClient();

 // 1. Fetch user rewards with the relevant reward info
 const { data: userRewards, error } = await supabase
  .from("user_rewards")
  .select(`
    user_id,
    reward_id,
    status,
    progress,
    reward:reward_id (
      ${type},
      requirements
    )
  `)
  .eq("user_id", userId)
  .eq("status", "AVAILABLE");

 if (error) throw error;
 if (!userRewards) return { updatedCount: 0, total: 0 };

 const updates: { user_id: number; reward_id: number; progress: number; status: "AVAILABLE" | "COMPLETE"; value: number }[] = [];

 // 2. Increment progress only for rewards that actually have a value > 0 for this type
 userRewards.forEach((ur: any) => {
  const rewardValue = ur.reward?.[type] ?? 0;
  if (rewardValue > 0) {
   const newProgress = (ur.progress ?? 0) + 1;
   const isComplete = newProgress >= (ur.reward?.requirements ?? Infinity);

   updates.push({
    user_id: ur.user_id,
    reward_id: ur.reward_id,
    progress: newProgress,
    status: isComplete ? "COMPLETE" : "AVAILABLE",
    value: rewardValue,
   });
  }
 });

 // 3. Update each relevant reward in DB
 for (const u of updates) {
  const { error: updateError } = await supabase
   .from("user_rewards")
   .update({ progress: u.progress, status: u.status })
   .eq("user_id", u.user_id)
   .eq("reward_id", u.reward_id);

  if (updateError) throw updateError;
 }

 // 4. Calculate total value for newly completed rewards
 const total = updates.filter((u) => u.status === "COMPLETE").reduce((sum, u) => sum + u.value, 0);

 return { updatedCount: updates.length, total };
}

