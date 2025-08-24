'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';


interface Test {
    id : string;
    setTest : Dispatch<SetStateAction<boolean>>;
}



export default function TestPage({id, setTest} : Test) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; correctAnswer?: string } | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
	// get the questions from db...
    const testId = id;
    const mcqs = [
    {
      id: 1,
      question: 'আর্থিক সাক্ষরতা বলতে কী বোঝানো হয়?',
      options: ['A: শুধু টাকা গণনা করা', 'B: আয়, খরচ, সঞ্চয় ও বিনিয়োগ নিয়ে সচেতন সিদ্ধান্ত নেওয়া', 'C: ঋণ ছাড়া খরচ করা', 'D: শুধু ব্যাংকে টাকা রাখা'],
      answer: 'B',
    },
    {
      id: 2,
      question: 'বাজেট তৈরির মূল উদ্দেশ্য কী?',
      options: ['A: খরচ কমানো ও সঞ্চয় বৃদ্ধি', 'B: ঋণ নেওয়া সহজ করা', 'C: শুধু টাকা গণনা করা', 'D: বিনিয়োগ এড়িয়ে যাওয়া'],
      answer: 'A',
    },
    {
      id: 3,
      question: 'স্বল্পমেয়াদি ও দীর্ঘমেয়াদি লক্ষ্য কিভাবে আলাদা?',
      options: ['A: সময়কাল ও প্রয়োজন অনুসারে', 'B: আয় বাড়ানোর জন্য', 'C: ঋণ নেওয়ার জন্য', 'D: ব্যালেন্স দেখানোর জন্য'],
      answer: 'A',
    }
  ];

  const handleSubmit = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === mcqs[currentIndex].answer;
    setFeedback({
      text: isCorrect ? 'Correct!' : 'Wrong!',
      correctAnswer: isCorrect ? undefined : `Correct answer: ${mcqs[currentIndex].options.find((opt) => opt.startsWith(mcqs[currentIndex].answer))}`,
    });
    if (isCorrect) setScore((prev) => prev + 10);
    setAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Smooth card transition
  const cardVariants: Variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, y: -20, transition: { type: 'spring', stiffness: 200, damping: 25 } },
  };

  // Feedback pop
  const feedbackVariants: Variants = {
    hidden: { scale: 0, opacity: 0, rotate: -10 },
    visible: { scale: 1, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12 } },
  };

  // Option hover animation
  const optionVariants: Variants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <div className="h-full p-4 bg-gradient-to-b from-blue-100 to-gray-100 flex flex-col items-center">
      {/* MCQ Card */}
      <div className="relative w-full max-w-2xl  overflow-y-auto bg-white rounded-lg shadow-xl p-6 flex flex-col justify-between [scrollbar-width:none] [-ms-overflow-style:none]">
        <AnimatePresence mode="wait">
          {currentIndex < mcqs.length ? (
            <motion.div
              key={currentIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col justify-center"
            >
              <motion.h2 variants={cardVariants} className="text-2xl font-bold mb-4 text-center">
                Question {currentIndex + 1} of {mcqs.length}
              </motion.h2>
              <motion.p variants={cardVariants} className="text-lg text-gray-700 mb-4 text-center">
                {mcqs[currentIndex].question}
              </motion.p>

              <motion.div variants={cardVariants} className="space-y-3 mb-4">
                {mcqs[currentIndex].options.map((option, i) => (
                  <motion.label
                    key={i}
                    className={`block p-3 rounded-lg cursor-pointer border ${
                      selectedOption === option[0]
                        ? 'bg-blue-100 border-blue-400'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    variants={optionVariants}
                    whileHover="hover"
                  >
                    <input
                      type="radio"
                      name={`q${mcqs[currentIndex].id}`}
                      value={option[0]}
                      checked={selectedOption === option[0]}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      disabled={answered}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </motion.label>
                ))}
              </motion.div>

              {feedback && (
                <motion.div
                  variants={feedbackVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-center mb-4 font-semibold ${
                    feedback.text === 'Correct!' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  <p>{feedback.text}</p>
                  {feedback.correctAnswer && <p>{feedback.correctAnswer}</p>}
                </motion.div>
              )}

              <motion.div className="flex justify-center">
                <button
                  onClick={answered ? handleNext : handleSubmit}
                  disabled={!selectedOption && !answered}
                  className={`px-6 py-3 rounded-lg shadow ${
                    !selectedOption && !answered
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {answered ? 'Next' : 'Done'}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                {score >= 70 ? '🎉 Congratulations!' : '💪 Nice Try!'}
              </h2>
              <p className="text-xl mb-4">
                Your Score: {score}/{mcqs.length * 10} ({Math.round((score / (mcqs.length * 10)) * 100)}%)
              </p>
              <p className="text-lg text-gray-700 mb-6 text-center">
                {score >= 70
                  ? 'Amazing work! You aced the test. Keep mastering your financial knowledge!'
                  : 'You’re making progress! Review the topics and try again to boost your score!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-6 flex justify-center gap-4 w-full max-w-2xl">
        {currentIndex < mcqs.length ? (
          <>
            <Link href="/dashboard/gamified-learning">
              <button className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600">
                Quit
              </button>
            </Link>
            <button
                onClick={() => setTest(false)} 
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
            Revise Topic
            </button>
          </>
        ) : (
          <Link href="/dashboard/gamified-learning">
            <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
              Home
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
