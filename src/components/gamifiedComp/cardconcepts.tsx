"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getCards } from "@/lib/actions/card";
import CoinLoading from "./coinload";
import { redirect } from "next/navigation";

interface Test {
    id : number;
    setTest : Dispatch<SetStateAction<boolean>>;
}

interface FormattedTextCard {
  title: string;
  shortDesc: string;
  fullContent: string;
}

function formatTextCards(rawCards: any[]): FormattedTextCard[] {
  return rawCards.map((card, index) => ({
    title: `${index + 1}. ${card.title}`,
    shortDesc: card.content.split("\n")[0].trim(), // first line as short description
    fullContent: card.content
      .replace(/\n+/g, " ") // replace all newlines with a space
      .trim()
  }));
}

export default function CardConcepts({id, setTest} : Test) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [concepts, setConcepts] = useState<FormattedTextCard[]>([]);
  const [loading, setLoading] = useState<boolean> (true);

  useEffect(() => {
      const fetchTestData = async () => {
        const response = await getCards(id, 'text');
        const formatted : FormattedTextCard[] = formatTextCards(response);
        setConcepts(formatted);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
      fetchTestData();
    }, []);



  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % concepts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  // ✅ Only fade transition, no slide
  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };


  if(loading){
    return <CoinLoading/>
  }
  if(concepts.length === 0){
    redirect('/dashboard/gamified-learning');
  }
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
            <h2 className="text-2xl font-bold mb-2">{concepts[currentIndex].title}</h2>
            <p className="text-lg text-gray-600 mb-4">{concepts[currentIndex].shortDesc}</p>
            <p>{concepts[currentIndex].fullContent}</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
            Go to Test
        </button>
      </div>
    </div>
  );
}
