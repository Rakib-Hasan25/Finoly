
"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { createUserLevelProgress, getUserLevelProgress, updateUserLevelProgress, UserLevelProgress } from "@/lib/actions/user-level-progress";
import { getUser, updateUser } from "@/lib/actions/users";
import { syncUserRewards, updateCompletedRewards } from "@/lib/actions/rewards";
import { toast } from "@/hooks/use-toast";

interface TestPageProps {
  userId: number;
  levelId : number;
  setTest: Dispatch<SetStateAction<boolean>>;
  cards: Array<{
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation?: string;
  }>;
  levelTitle?: string;
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


const updateDb = async (userId : number, levelId : number, score : any, passed : any) => {
  // console.log("updating db");
  const prev = await getUserLevelProgress(userId, levelId);

  let scorediff = 0;
  let attemp = 0;

  if(prev == null){
    scorediff = score;
    attemp = 1;
    const data : Omit<UserLevelProgress, "id" | "created_at" | "updated_at"> = {
      user_id: userId,
      level_id: levelId,
      status: passed ? "completed" : "in_progress",
      progression: 1,
      score: score,
      attempts: 1,
      completed_at: new Date().toISOString(),
    }
    await createUserLevelProgress(data);
  } else {
    const nScore = Math.max(score, prev.score);
    const npassed = passed || prev.status === 'completed';
    scorediff = Math.max(score - prev.score, 0);
    attemp = prev.attempts + 1;
    const data : Partial<UserLevelProgress> = {
      user_id: userId,
      level_id: levelId,
      status: npassed ? "completed" : "in_progress",
      progression: 1,
      score: nScore,
      attempts: prev.attempts + 1,
      completed_at: new Date().toISOString(),
    }
    await updateUserLevelProgress(userId, levelId, data);
  }
  // console.log(res);


  const adxp = (scorediff <= 0) ? 0 : scorediff - (attemp - 1) * 2;
  const { xp, health } = await getUser(userId);
  const data = {
    xp : xp + adxp,
    health : health - (passed ? 0 : 1)
  }
  await updateUser(userId, data);
  await rewardCalc(userId, score, passed);
  
}

const rewardCalc = async (userId : number, score : any, passed : any) => {
  await syncUserRewards(userId);
  if(score >= 100){
    const {updatedCount, total} = await updateCompletedRewards(userId, 'health');
    if (updatedCount > 0 && total > 0) {
      toast({
        title : `🎉 Earned +${total} health`,
        description : `You earned health, check the reward section and claim.`
      })
    }
  }
  if(passed){
    const {updatedCount, total} = await updateCompletedRewards(userId, 'points');
    if (updatedCount > 0 && total > 0) {
      toast({
        title : `🎉 Earned +${total} XP`,
        description : `You earned XP, check the reward section and claim.`
      })
    }
  }
}



export default function TestPage({
  userId,
  levelId,
  setTest,
  cards,
  levelTitle,
}: TestPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    correctAnswer?: string;
    explanation?: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    const card = cards[currentIndex];
    const isCorrect = selectedOption === card.options[card.answer];
    setFeedback({
      text: isCorrect ? "Correct!" : "Incorrect!",
      correctAnswer: isCorrect
        ? undefined
        : `Correct answer: ${card.options[card.answer]}`,
      explanation: card.explanation,
    });
    if (isCorrect) setScore((prev) => prev + 10);
    setAnswered(true);
  };

  const handleFinish = () => {
    const percentage = (score / (cards.length * 10)) * 100;
    const passed = percentage >= 70;
    updateDb(userId, levelId, score, passed).then(()=>{
      setFinished(true);
    })
  }

  const handleNext = () => {
    if (currentIndex === cards.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setFeedback(null);
    setAnswered(false);
  };

  const handleOptionSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const feedbackVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  if (finished) {
    const percentage = (score / (cards.length * 10)) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a003f] via-[#1a1a6b] to-[#0d1b2a] p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-gradient-to-b from-indigo-900/50 to-blue-900/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-6">
            {passed ? "🎉 Congratulations!" : "😔 Keep Learning!"}
          </h2>
          <p className="text-2xl mb-4">
            Your Score: {score}/{cards.length * 10}
          </p>
          <p className="text-xl mb-8">{percentage.toFixed(1)}% Correct</p>

          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => setTest(false)}
              className="w-40"
            >
              Review Concepts
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setFinished(false);
              }}
              className="w-40"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a003f] via-[#1a1a6b] to-[#0d1b2a] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {levelTitle || "Quiz Time!"}
        </h1>
        <div className="w-full h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gradient-to-b from-indigo-900/50 to-blue-900/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm"
        >
          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8">
            {cards[currentIndex].question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {cards[currentIndex].options.map((option, index) => (
              <motion.button
                key={index}
                variants={optionVariants}
                custom={index}
                onClick={() => !answered && handleOptionSelect(option)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  selectedOption === option
                    ? answered
                      ? option ===
                        cards[currentIndex].options[cards[currentIndex].answer]
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                } ${
                  answered &&
                  option ===
                    cards[currentIndex].options[cards[currentIndex].answer]
                    ? "bg-green-600 text-white"
                    : ""
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                variants={feedbackVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm"
              >
                <p className="text-white font-bold">{feedback.text}</p>
                {feedback.correctAnswer && (
                  <p className="text-green-400 mt-2">
                    {feedback.correctAnswer}
                  </p>
                )}
                {feedback.explanation && (
                  <p className="text-gray-300 mt-2">{feedback.explanation}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setTest(false)}>
              Back to Concepts
            </Button>
            {!answered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={
                  !selectedOption
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-600 text-black"
                }
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={
                  currentIndex === cards.length - 1
                    ? handleFinish
                    : handleNext
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentIndex === cards.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Score */}
        <div className="mt-4 text-center text-white">
          <p className="text-xl font-bold">
            Score: {score}/{cards.length * 10}
          </p>
        </div>
      </div>
    </div>
  );
}
