"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
interface CardConceptsProps {
  id: string;
  setTest: Dispatch<SetStateAction<boolean>>;
  cards: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  levelTitle?: string;
}

export default function CardConcepts({
  setTest,
  cards,
  levelTitle,
}: CardConceptsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">{levelTitle}</h2>
        <p>No content cards available for this level.</p>
        <Button className="mt-4" onClick={() => setTest(true)}>
          Skip to Test
        </Button>
      </div>
    );
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // ✅ Only fade transition, no slide
  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="h-screen w-full px-24 py-8 bg-gray-100 flex flex-col items-center">
      {/* Content Div: fills screen, scrolls internally if overflow */}
      <div className="relative w-full max-w-2xl h-full bg-white rounded-lg shadow-lg p-6 text-justify overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]">
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="w-full whitespace-normal break-normal"
          >
            <h2 className="text-2xl font-bold mb-2">
              {cards[currentIndex].title}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {cards[currentIndex].title}
            </p>
            <p>{cards[currentIndex].content}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - OUTSIDE the content div */}
        <div className="fixed top-1/2 left-72 -translate-y-1/2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200"
          >
            ← Prev
          </button>
        </div>

        <div className="fixed top-1/2 right-8 -translate-y-1/2">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-4 flex justify-center gap-4 w-full max-w-2xl">
        <Link href="/dashboard/gamified-learning">
          <button className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600">
            Back to Home
          </button>
        </Link>
        <button
          onClick={() => setTest(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Go to Test
        </button>
      </div>
    </div>
  );
}
