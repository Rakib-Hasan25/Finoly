import { useState } from 'react';
import { MessageCircle, TrendingUp, PiggyBank, CreditCard, Target, Calculator, Shield, Home, Car, GraduationCap, Heart, Plane } from 'lucide-react';

const sampleQuestions = [
  {
    icon: <Calculator className="w-5 h-5" />,
    text: "How do I create a budget?",
    category: "Budgeting"
  },
  {
    icon: <PiggyBank className="w-5 h-5" />,
    text: "How much should I save for emergencies?",
    category: "Savings"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    text: "What's the best way to start investing?",
    category: "Investing"
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    text: "How can I improve my credit score?",
    category: "Credit"
  },
  {
    icon: <Target className="w-5 h-5" />,
    text: "How do I set financial goals?",
    category: "Goal Setting"
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    text: "What's the best way to pay off debt?",
    category: "Debt Management"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    text: "What insurance do I really need?",
    category: "Insurance"
  },
  {
    icon: <Home className="w-5 h-5" />,
    text: "How much should I save for a down payment?",
    category: "Home Buying"
  },
  {
    icon: <Car className="w-5 h-5" />,
    text: "Should I buy or lease a car?",
    category: "Vehicle Finance"
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    text: "How do I save for my child's education?",
    category: "Education Planning"
  },
  {
    icon: <Heart className="w-5 h-5" />,
    text: "How do I talk to my partner about money?",
    category: "Relationships"
  },
  {
    icon: <Plane className="w-5 h-5" />,
    text: "How can I travel on a budget?",
    category: "Lifestyle"
  }
];

interface ChatDemoProps {
  onQuestionClick: (question: string) => void;
}

export function ChatDemo({ onQuestionClick }: ChatDemoProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(sampleQuestions.map(q => q.category)));

  const filteredQuestions = selectedCategory 
    ? sampleQuestions.filter(q => q.category === selectedCategory)
    : sampleQuestions;

  return (
    <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
          💡 Quick Start Questions
        </h3>
        <p className="text-gray-400">
          Click on any question below to start a conversation with your AI Financial Coach
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-[rgb(87,204,2)] text-[rgb(25,45,54)]'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Topics
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-[rgb(87,204,2)] text-[rgb(25,45,54)]'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sample Questions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question.text)}
            className="flex items-start gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group"
          >
            <div className="text-[rgb(87,204,2)] group-hover:scale-110 transition-transform">
              {question.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-200 font-medium text-sm leading-relaxed">
                {question.text}
              </p>
              <span className="text-xs text-gray-500 mt-1 block">
                {question.category}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 mb-3">
          Or type your own question in the chat below
        </p>
        <div className="flex items-center justify-center gap-2 text-[rgb(87,204,2)]">
          <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-pulse"></div>
          <span className="text-sm">AI Financial Coach is ready to help!</span>
          <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
