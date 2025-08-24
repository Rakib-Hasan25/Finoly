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
    <div className="min-h-screen bg-gradient-to-b from-[#2a003f] via-[#1a1a6b] to-[#0d1b2a] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{levelTitle}</h1>
        <div className="w-full h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-b from-indigo-900/50 to-blue-900/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm"
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
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="w-32"
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {cards.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          idx === currentIndex
                            ? "bg-blue-500"
                            : idx < currentIndex
                            ? "bg-blue-800"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {currentIndex === cards.length - 1 ? (
                    <Button
                      onClick={() => setTest(true)}
                      className="w-32 bg-green-600 hover:bg-green-700"
                    >
                      Start Test
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="w-32 bg-green-600 hover:bg-green-700"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
