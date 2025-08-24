"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Test {
    id : string;
    setTest : Dispatch<SetStateAction<boolean>>;
}


export default function CardConcepts({id, setTest} : Test) {
  const [currentIndex, setCurrentIndex] = useState(0);

    // make it from db..
	const testId = id;
  const concepts = [
    { 
            title: "1. Budget Basics", 
            shortDesc: "Learn how to create a simple budget.", 
            fullContent: "আর্থিক সাক্ষরতা \
             মানে কেবল টাকার হিসাব রাখা নয়। এটি হলো আয়, খরচ, সঞ্চয়, বিনিয়োগ এবং ঋণ সম্পর্কে সচেতন সিদ্ধান্ত নেওয়ার ক্ষমতা। \
             যারা আর্থিকভাবে সচেতন, তারা দৈনন্দিন ও দীর্ঘমেয়াদি আর্থিক সিদ্ধান্ত অনেক সহজে নিতে পারে।" 
        },
    { 
            title: "2. Saving Strategies", 
            shortDesc: "Effective ways to save money.", 
            fullContent: "প্রত্যেকের আয় সীমিত, \
            তাই পরিকল্পনা ছাড়া তা যথেষ্ট মনে হবে না। বাজেট তৈরি করলে খরচ নিয়ন্ত্রণে থাকে এবং সঞ্চয় বাড়ে। একটি সাধারণ ফর্মুলা হলো: \
            Income – Expense = Savings → Investment এটি শিক্ষার্থীদের দেখায় কিভাবে আয়ের অংশ ভাগ করে সঞ্চয় ও বিনিয়োগ করা যায়। \
            পরিকল্পিত বাজেট জীবনের অপ্রয়োজনীয় খরচ কমায় এবং ভবিষ্যতের লক্ষ্য অর্জনে সাহায্য করে।" 
        },
    { 
            title: "3. Investing 101", 
            shortDesc: "Introduction to investing.", 
            fullContent: "আর্থিক লক্ষ্য নির্ধারণ করা সবচেয়ে গুরুত্বপূর্ণ ধাপ। \
            লক্ষ্য ছাড়া আপনি সঞ্চয় বা বিনিয়োগের সঠিক পথ নির্ধারণ করতে পারবেন না। \
            স্বল্পমেয়াদি লক্ষ্য হতে পারে ল্যাপটপ কেনা, ভ্রমণ বা ছোট খরচের প্রয়োজন। \
            মধ্যমেয়াদি লক্ষ্য হতে পারে উচ্চশিক্ষা বা ব্যবসা শুরু। \
            দীর্ঘমেয়াদি লক্ষ্য হতে পারে বাড়ি কেনা বা অবসর জীবন পরিকল্পনা। \
            লক্ষ্য নির্ধারণ করলে পরিকল্পনা আরও কার্যকর ও ফলপ্রসূ হয়।"
        },
    ];

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
