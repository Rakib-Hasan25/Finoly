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
  type: "text" | "quiz";
  order: number;
  course_level_id: number;
  created_at: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: "A" | "B" | "C" | "D";
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
    type: "text" as "text" | "quiz",
    order: 0,
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A" as "A" | "B" | "C" | "D",
  });
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
    const cardData = {
      title: newCard.title,
      content: newCard.content,
      type: newCard.type,
      order: cards.length,
      course_level_id: parseInt(levelId),
      ...(newCard.type === "quiz" && {
        option_a: newCard.option_a,
        option_b: newCard.option_b,
        option_c: newCard.option_c,
        option_d: newCard.option_d,
        correct_answer: newCard.correct_answer,
      }),
    };

    const { error } = await supabase.from("cards").insert([cardData]);

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
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    });
    await fetchCards();
    setLoading(false);
  }

  async function updateCard() {
    if (!supabase || !editingCard) return;
    setLoading(true);
    const updateData = {
      title: editingCard.title,
      content: editingCard.content,
      type: editingCard.type,
      ...(editingCard.type === "quiz" && {
        option_a: editingCard.option_a,
        option_b: editingCard.option_b,
        option_c: editingCard.option_c,
        option_d: editingCard.option_d,
        correct_answer: editingCard.correct_answer,
      }),
    };

    const { error } = await supabase
      .from("cards")
      .update(updateData)
      .eq("id", editingCard.id);

    if (error) {
      console.error("Error updating card:", error);
      return;
    }

    setIsEditOpen(false);
    setEditingCard(null);
    await fetchCards();
    setLoading(false);
  }

  function startEditing(card: CardType) {
    setEditingCard({ ...card });
    setIsEditOpen(true);
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
                <Label htmlFor="card-type">Card Type</Label>
                <select
                  id="card-type"
                  value={newCard.type}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      type: e.target.value as "text" | "quiz",
                    })
                  }
                  className="w-full bg-[rgb(35,55,64)] border-white/20 rounded-md text-white p-2"
                >
                  <option value="text">Text Card</option>
                  <option value="quiz">Quiz Card</option>
                </select>
              </div>
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
                <Label htmlFor="content">
                  {newCard.type === "text" ? "Content" : "Question"}
                </Label>
                <Textarea
                  id="content"
                  value={newCard.content}
                  onChange={(e) =>
                    setNewCard({ ...newCard, content: e.target.value })
                  }
                  rows={newCard.type === "text" ? 5 : 2}
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              {newCard.type === "quiz" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="option-a">Option A</Label>
                      <Input
                        id="option-a"
                        value={newCard.option_a}
                        onChange={(e) =>
                          setNewCard({ ...newCard, option_a: e.target.value })
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option-b">Option B</Label>
                      <Input
                        id="option-b"
                        value={newCard.option_b}
                        onChange={(e) =>
                          setNewCard({ ...newCard, option_b: e.target.value })
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option-c">Option C</Label>
                      <Input
                        id="option-c"
                        value={newCard.option_c}
                        onChange={(e) =>
                          setNewCard({ ...newCard, option_c: e.target.value })
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option-d">Option D</Label>
                      <Input
                        id="option-d"
                        value={newCard.option_d}
                        onChange={(e) =>
                          setNewCard({ ...newCard, option_d: e.target.value })
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <select
                      id="correct-answer"
                      value={newCard.correct_answer}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          correct_answer: e.target.value as
                            | "A"
                            | "B"
                            | "C"
                            | "D",
                        })
                      }
                      className="w-full bg-[rgb(35,55,64)] border-white/20 rounded-md text-white p-2"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </>
              )}
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

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[rgb(25,45,54)] text-white">
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
              <DialogDescription className="text-gray-400">
                Edit card content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-card-type">Card Type</Label>
                <select
                  id="edit-card-type"
                  value={editingCard?.type || "text"}
                  onChange={(e) =>
                    setEditingCard((prev) =>
                      prev
                        ? { ...prev, type: e.target.value as "text" | "quiz" }
                        : null
                    )
                  }
                  className="w-full bg-[rgb(35,55,64)] border-white/20 rounded-md text-white p-2"
                >
                  <option value="text">Text Card</option>
                  <option value="quiz">Quiz Card</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Card Title</Label>
                <Input
                  id="edit-title"
                  value={editingCard?.title || ""}
                  onChange={(e) =>
                    setEditingCard((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">
                  {editingCard?.type === "quiz" ? "Question" : "Content"}
                </Label>
                <Textarea
                  id="edit-content"
                  value={editingCard?.content || ""}
                  onChange={(e) =>
                    setEditingCard((prev) =>
                      prev ? { ...prev, content: e.target.value } : null
                    )
                  }
                  rows={editingCard?.type === "quiz" ? 2 : 5}
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              {editingCard?.type === "quiz" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-option-a">Option A</Label>
                      <Input
                        id="edit-option-a"
                        value={editingCard?.option_a || ""}
                        onChange={(e) =>
                          setEditingCard((prev) =>
                            prev ? { ...prev, option_a: e.target.value } : null
                          )
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-option-b">Option B</Label>
                      <Input
                        id="edit-option-b"
                        value={editingCard?.option_b || ""}
                        onChange={(e) =>
                          setEditingCard((prev) =>
                            prev ? { ...prev, option_b: e.target.value } : null
                          )
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-option-c">Option C</Label>
                      <Input
                        id="edit-option-c"
                        value={editingCard?.option_c || ""}
                        onChange={(e) =>
                          setEditingCard((prev) =>
                            prev ? { ...prev, option_c: e.target.value } : null
                          )
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-option-d">Option D</Label>
                      <Input
                        id="edit-option-d"
                        value={editingCard?.option_d || ""}
                        onChange={(e) =>
                          setEditingCard((prev) =>
                            prev ? { ...prev, option_d: e.target.value } : null
                          )
                        }
                        className="bg-[rgb(35,55,64)] border-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-correct-answer">Correct Answer</Label>
                    <select
                      id="edit-correct-answer"
                      value={editingCard?.correct_answer || "A"}
                      onChange={(e) =>
                        setEditingCard((prev) =>
                          prev
                            ? {
                                ...prev,
                                correct_answer: e.target.value as
                                  | "A"
                                  | "B"
                                  | "C"
                                  | "D",
                              }
                            : null
                        )
                      }
                      className="w-full bg-[rgb(35,55,64)] border-white/20 rounded-md text-white p-2"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </>
              )}
              <Button
                onClick={updateCard}
                className="w-full"
                disabled={loading}
              >
                Update Card
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
                    {card.type === "text" ? (
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {card.content}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-white">{card.content}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">A:</span>
                            <span className="text-gray-400">
                              {card.option_a}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">B:</span>
                            <span className="text-gray-400">
                              {card.option_b}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">C:</span>
                            <span className="text-gray-400">
                              {card.option_c}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">D:</span>
                            <span className="text-gray-400">
                              {card.option_d}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-green-400">
                          Correct Answer: {card.correct_answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => startEditing(card)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCard(card.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
