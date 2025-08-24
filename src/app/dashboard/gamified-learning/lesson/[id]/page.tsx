"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardConcepts from "@/components/gamifiedComp/cardconcepts";
import TestPage from "@/components/gamifiedComp/mcqtest";
import { getLevelById } from "@/lib/actions/level";
import { getCards } from "@/lib/actions/card";

export default function Lesson() {
  const { id } = useParams(); // Lesson ID from URL
  const lessonID = parseInt(id[0], 10);
  const [test, setTest] = useState<boolean>(false);
  const [levelData, setLevelData] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const level = await getLevelById(id as string);
        const levelCards = await getCards(id as string);
        setLevelData(level);
        setCards(levelCards);
      } catch (error) {
        console.error("Error fetching level data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {test ? (
        <TestPage
          id={id as string}
          setTest={setTest}
          cards={cards
            .filter((card) => card.type === "quiz")
            .map((card) => ({
              id: card.id,
              question: card.content,
              options: [
                card.option_a,
                card.option_b,
                card.option_c,
                card.option_d,
              ],
              answer:
                card.correct_answer.toLowerCase().charCodeAt(0) -
                "a".charCodeAt(0),
            }))}
        />
      ) : (
        <CardConcepts
          id={id as string}
          setTest={setTest}
          cards={cards.filter((card) => card.type === "text")}
          levelTitle={levelData?.title}
        />
      )}
    </div>
  );
}
