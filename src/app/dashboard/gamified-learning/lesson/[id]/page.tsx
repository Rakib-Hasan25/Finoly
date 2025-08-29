"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardConcepts from "@/components/gamifiedComp/cardconcepts";
import TestPage from "@/components/gamifiedComp/mcqtest";
import CoinLoading from "@/components/gamifiedComp/coinload";
import { getLevelById } from "@/lib/actions/level";
import { getCards } from "@/lib/actions/card";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail } from "@/lib/actions/users";

export default function Lesson() {
  const { id } = useParams();
  const lessonID = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const { user } = useAuth();

  const [userId, setUserId] = useState<number | null>(null);
  const [test, setTest] = useState(false);
  const [levelData, setLevelData] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user ID
  useEffect(() => {
    if (!user?.email) return;
    getUserByEmail(user.email)
      .then((data) => setUserId(data?.id ?? null))
      .catch(console.error);
  }, [user?.email]);

  // Fetch lesson data once lessonID is available
  useEffect(() => {
    if (!lessonID) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [level, levelCards] = await Promise.all([
          getLevelById(lessonID.toString()),
          getCards(lessonID.toString()),
        ]);
        setLevelData(level);
        setCards(levelCards);
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonID]);

  if (loading || !userId) return <CoinLoading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="h-full w-full">
      {test ? (
        <TestPage
          userId={userId}
          levelId={lessonID}
          setTest={setTest}
          cards={cards
            .filter((c) => c.type === "quiz")
            .map((c) => ({
              id: c.id,
              question: c.content,
              options: [c.option_a, c.option_b, c.option_c, c.option_d],
              answer:
                c.correct_answer.toLowerCase().charCodeAt(0) -
                "a".charCodeAt(0),
            }))}
        />
      ) : (
        <CardConcepts
          id={lessonID.toString()}
          setTest={setTest}
          cards={cards.filter((c) => c.type === "text")}
          levelTitle={levelData?.title}
        />
      )}
    </div>
  );
}
