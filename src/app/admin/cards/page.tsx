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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CardType = {
  id: number;
  title: string;
  content: string;
  course_level_id: number;
  created_at: string;
  levels?: {
    title: string;
    courses: {
      name: string;
    };
  };
};

type Level = {
  id: number;
  title: string;
  course_id: number;
  courses: {
    name: string;
  };
};

export default function CardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [newCard, setNewCard] = useState({
    title: "",
    content: "",
    course_level_id: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    if (supabase) {
      fetchCards();
      fetchLevels();
    }
  }, [supabase]);

  async function fetchLevels() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("levels")
      .select(
        `
        id,
        title,
        course_id,
        courses (
          name
        )
      `
      )
      .order("level_no", { ascending: true });

    if (error) {
      console.error("Error fetching levels:", error);
      return;
    }

    setLevels(data || []);
  }

  async function fetchCards() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cards")
      .select(
        `
        *,
        levels (
          title,
          courses (
            name
          )
        )
      `
      )
      .order("created_at", { ascending: false });

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
        course_level_id: parseInt(newCard.course_level_id),
      },
    ]);

    if (error) {
      console.error("Error creating card:", error);
      return;
    }

    setIsOpen(false);
    setNewCard({ title: "", content: "", course_level_id: "" });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cards</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Card</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
              <DialogDescription>Add a new card to a level</DialogDescription>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={newCard.course_level_id}
                  onValueChange={(value) =>
                    setNewCard({ ...newCard, course_level_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.courses.name} - {level.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Card key={card.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-sm text-gray-500">
                    Level: {card.levels?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Course: {card.levels?.courses.name}
                  </p>
                  <div className="mt-4">
                    <p className="text-gray-600">{card.content}</p>
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
