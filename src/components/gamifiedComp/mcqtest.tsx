'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { getCards } from '@/lib/actions/card';
import CoinLoading from './coinload';
77


interface Test {
    id : number;
    setTest : Dispatch<SetStateAction<boolean>>;
}
interface FormattedQuiz {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

function formatQuizList(rawQuizzes : any[]) : FormattedQuiz[] {
  return rawQuizzes.map((q, index) => ({
    id: index + 1, // sequential id
    question: q.content.trim(),
    options: [
      `A: ${q.option_a.trim()}`,
      `B: ${q.option_b.trim()}`,
      `C: ${q.option_c.trim()}`,
      `D: ${q.option_d.trim()}`
    ],
    answer: q.correct_answer
  }));
}



export default function TestPage({id, setTest} : Test) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; correctAnswer?: string } | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizList, setQuizList] = useState<FormattedQuiz[]>([]);
  const [loading, setLoading] = useState<boolean> (true);

  useEffect(() => {
    const fetchTestData = async () => {
      const response = await getCards(id, 'quiz');
      const formatted : FormattedQuiz[] = formatQuizList(response);
      setQuizList(formatted);
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
    fetchTestData();
  }, []);


  const handleSubmit = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === quizList[currentIndex].answer;
    setFeedback({
      text: isCorrect ? 'Correct!' : 'Wrong!',
      correctAnswer: isCorrect ? undefined : `Correct answer: ${quizList[currentIndex].options.find((opt) => opt.startsWith(quizList[currentIndex].answer))}`,
    });
    if (isCorrect) setScore((prev) => prev + 10);
    setAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setAnswered(false);
    setCurrentIndex((prev) => prev + 1);
    if(currentIndex == quizList.length - 1) {
      alert("Test Completed");
    }
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

  if(loading){
    return <CoinLoading/>
  }

  return (
    <div className="h-full p-4 bg-gradient-to-b from-blue-100 to-gray-100 flex flex-col items-center">
      {/* MCQ Card */}
      <div className="relative w-full max-w-2xl  overflow-y-auto bg-white rounded-lg shadow-xl p-6 flex flex-col justify-between [scrollbar-width:none] [-ms-overflow-style:none]">
        <AnimatePresence mode="wait">
          {currentIndex < quizList.length ? (
            <motion.div
              key={currentIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col justify-center"
            >
              <motion.h2 variants={cardVariants} className="text-2xl font-bold mb-4 text-center">
                Question {currentIndex + 1} of {quizList.length}
              </motion.h2>
              <motion.p variants={cardVariants} className="text-lg text-gray-700 mb-4 text-center">
                {quizList[currentIndex].question}
              </motion.p>

              <motion.div variants={cardVariants} className="space-y-3 mb-4">
                {quizList[currentIndex].options.map((option, i) => (
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
                      name={`q${quizList[currentIndex].id}`}
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
                Your Score: {score}/{quizList.length * 10} ({Math.round((score / (quizList.length * 10)) * 100)}%)
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
        {currentIndex < quizList.length ? (
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
