"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

type CardType = {
  id: number;
  title: string;
  content: string;
  type: string;
  order: number;
  course_level_id: number;
  created_at: string;
};

type Level = {
  id: number;
  title: string;
  level_no: number;
  course_id: number;
  created_at: string;
};

export default function LevelPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const supabase = useSupabase();
  const [level, setLevel] = useState<Level | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [newCard, setNewCard] = useState({
    title: "",
    content: "",
    type: "text",
    order: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supabase && levelId) {
      fetchLevel();
      fetchCards();
    }
  }, [supabase, levelId]);

  async function fetchLevel() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("levels")
      .select("*")
      .eq("id", levelId)
      .single();

    if (error) {
      console.error("Error fetching level:", error);
      return;
    }

    setLevel(data);
  }

  async function fetchCards() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("course_level_id", levelId)
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching cards:", error);
      return;
    }

    setCards(data || []);
    setLoading(false);
  }

  async function createCard() {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("cards").insert([
      {
        title: newCard.title,
        content: newCard.content,
        type: newCard.type,
        order: cards.length,
        course_level_id: parseInt(levelId),
      },
    ]);

    if (error) {
      console.error("Error creating card:", error);
      return;
    }

    setIsOpen(false);
    setNewCard({
      title: "",
      content: "",
      type: "text",
      order: 0,
    });
    await fetchCards();
    setLoading(false);
  }

  async function deleteCard(id: number) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("cards").delete().eq("id", id);

    if (error) {
      console.error("Error deleting card:", error);
      return;
    }

    await fetchCards();
    setLoading(false);
  }

  if (!level) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{level.title}</h1>
          <p className="text-gray-400 mt-1">Level {level.level_no}</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Card</Button>
          </DialogTrigger>
          <DialogContent className="bg-[rgb(25,45,54)] text-white">
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new card to {level.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard({ ...newCard, title: e.target.value })
                  }
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newCard.content}
                  onChange={(e) =>
                    setNewCard({ ...newCard, content: e.target.value })
                  }
                  rows={5}
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <Button
                onClick={createCard}
                className="w-full"
                disabled={loading}
              >
                Create Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="p-6 space-y-4 bg-[rgb(35,55,64)] border-white/10 text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <div className="mt-4">
                    <p className="text-gray-400 whitespace-pre-wrap">
                      {card.content}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCard(card.id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
