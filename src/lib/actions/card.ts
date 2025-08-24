'use server'
import { createClient } from "@/lib/supabase/server";

export async function getCards(levelId: number, type : string) {
  const supabase = await createClient();

  const { data: cards, error } = await supabase
    .from("cards")
    .select("*")
    .eq("course_level_id", levelId)
    .eq("type", type)
    .order("order", { ascending: true });

  if (error) {
    console.error(`Error fetching cards for level ${levelId}:`, error);
    throw error;
  }

  return cards;
}

export async function getCardById(cardId: string) {
  const supabase = await createClient();

  const { data: card, error } = await supabase
    .from("quiz_cards")
    .select("*")
    .eq("id", cardId)
    .single();

  if (error) {
    console.error(`Error fetching card ${cardId}:`, error);
    throw error;
  }

  return card;
}

export async function createCard(data: {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  explanation?: string;
  points: number;
  level_id: string;
  order: number;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
}) {
  const supabase = await createClient();

  const { data: card, error } = await supabase
    .from("quiz_cards")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating quiz card:", error);
    throw error;
  }

  return card;
}

export async function updateCard(
  cardId: string,
  data: Partial<{
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    explanation: string;
    points: number;
    order: number;
    difficulty: "easy" | "medium" | "hard";
    category: string;
  }>
) {
  const supabase = await createClient();

  const { data: card, error } = await supabase
    .from("quiz_cards")
    .update(data)
    .eq("id", cardId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating quiz card ${cardId}:`, error);
    throw error;
  }

  return card;
}

export async function deleteCard(cardId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("quiz_cards").delete().eq("id", cardId);

  if (error) {
    console.error(`Error deleting quiz card ${cardId}:`, error);
    throw error;
  }
}

export async function reorderCards(levelId: string, cardIds: string[]) {
  const supabase = await createClient();

  // Create an array of updates with new order values
  const updates = cardIds.map((id, index) => ({
    id,
    order: index + 1,
  }));

  const { error } = await supabase
    .from("quiz_cards")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error(`Error reordering cards for level ${levelId}:`, error);
    throw error;
  }
}

export async function bulkCreateCards(
  levelId: string,
  cards: Array<{
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    explanation?: string;
    points: number;
    difficulty: "easy" | "medium" | "hard";
    category?: string;
  }>
) {
  const supabase = await createClient();

  // Get the current highest order
  const { data: existingCards } = await supabase
    .from("quiz_cards")
    .select("order")
    .eq("level_id", levelId)
    .order("order", { ascending: false })
    .limit(1);

  const startOrder = (existingCards?.[0]?.order || 0) + 1;

  // Prepare the cards data with order and level_id
  const cardsData = cards.map((card, index) => ({
    ...card,
    level_id: levelId,
    order: startOrder + index,
  }));

  const { data, error } = await supabase
    .from("quiz_cards")
    .insert(cardsData)
    .select();

  if (error) {
    console.error("Error bulk creating quiz cards:", error);
    throw error;
  }

  return data;
}
