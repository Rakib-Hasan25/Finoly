import { useState } from 'react';
import { MessageCircle, TrendingUp, PiggyBank, CreditCard, Target, Calculator, Shield, Home, Car, GraduationCap, Heart, Plane } from 'lucide-react';

const sampleQuestions = [
  {
    icon: <Calculator className="w-5 h-5" />,
    text: "আমি কীভাবে বাজেট তৈরি করব?",
    category: "বাজেটিং"
  },
  {
    icon: <PiggyBank className="w-5 h-5" />,
    text: "জরুরি অবস্থার জন্য আমার কতটা সঞ্চয় করা উচিত?",
    category: "সঞ্চয়"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    text: "বিনিয়োগ শুরু করার সর্বোত্তম উপায় কী?",
    category: "বিনিয়োগ"
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    text: "আমি কীভাবে আমার ক্রেডিট স্কোর উন্নত করতে পারি?",
    category: "ক্রেডিট"
  },
  {
    icon: <Target className="w-5 h-5" />,
    text: "আমি কীভাবে আর্থিক লক্ষ্য নির্ধারণ করব?",
    category: "লক্ষ্য নির্ধারণ"
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    text: "ঋণ পরিশোধ করার সর্বোত্তম উপায় কী?",
    category: "ঋণ ব্যবস্থাপনা"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    text: "আমার কী বীমা সত্যিই প্রয়োজন?",
    category: "বীমা"
  },
  {
    icon: <Home className="w-5 h-5" />,
    text: "ডাউন পেমেন্টের জন্য আমার কতটা সঞ্চয় করা উচিত?",
    category: "বাড়ি কেনা"
  },
  {
    icon: <Car className="w-5 h-5" />,
    text: "আমি গাড়ি কিনব নাকি লিজ করব?",
    category: "গাড়ির অর্থ"
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    text: "আমি কীভাবে আমার সন্তানের শিক্ষার জন্য সঞ্চয় করব?",
    category: "শিক্ষা পরিকল্পনা"
  },
  {
    icon: <Heart className="w-5 h-5" />,
    text: "আমি কীভাবে আমার সঙ্গীর সাথে টাকার বিষয়ে কথা বলব?",
    category: "সম্পর্ক"
  },
  {
    icon: <Plane className="w-5 h-5" />,
    text: "আমি কীভাবে কম খরচে ভ্রমণ করতে পারি?",
    category: "জীবনধারা"
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
          💡 দ্রুত শুরু প্রশ্ন
        </h3>
        <p className="text-gray-400">
          নীচের যেকোনো প্রশ্নে ক্লিক করে আপনার AI আর্থিক কোচের সাথে কথোপকথন শুরু করুন
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
          সব বিষয়
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
          অথবা নীচের চ্যাটে আপনার নিজের প্রশ্ন টাইপ করুন
        </p>
        <div className="flex items-center justify-center gap-2 text-[rgb(87,204,2)]">
          <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-pulse"></div>
          <span className="text-sm">AI আর্থিক কোচ সাহায্য করতে প্রস্তুত!</span>
          <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
