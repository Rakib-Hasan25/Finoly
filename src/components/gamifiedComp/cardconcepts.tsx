"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

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
      <div className="min-h-screen bg-gradient-to-b from-[#2a003f] via-[#1a1a6b] to-[#0d1b2a] p-6 flex flex-col items-center justify-center text-white">
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

  const variants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#052F2F] via-[#0A2647] to-[#052F2F] p-6">
      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">{levelTitle}</h1>
        <div className="w-full h-2 bg-white/10 rounded-full">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center h-[60vh] relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white">
                  {cards[currentIndex].title}
                </h2>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {cards[currentIndex].content}
                  </p>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-8">
                  <Button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="w-32 bg-teal-600 text-white hover:bg-teal-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-2 mx-20">
                    {cards.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          idx === currentIndex
                            ? "bg-cyan-500"
                            : idx < currentIndex
                            ? "bg-cyan-700/80"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={
                      currentIndex === cards.length - 1
                        ? () => setTest(true)
                        : handleNext
                    }
                    className="w-32 bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    {currentIndex === cards.length - 1 ? "Start Test" : "Next"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
