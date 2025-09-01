"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaUserPlus, FaLink, FaBrain, FaTrophy } from 'react-icons/fa';
import {  FaUserCircle, FaUserNinja, FaUserSecret, FaUserTie } from 'react-icons/fa';
import Footer from "./footer";
import heroImg from "../app/images/Growth.png"; 
import MG from "../app/images/Money Growth.png";
import sagorImage from '../app/images/MD Sagor Chowdhury.jpg';
import sajibImage from '../app/images/Sojib Bhattacharjee.png';
import ratnajitImage from '../app/images/Ratnajit Dhar.png';
import sowravImage from '../app/images/Sowrav Nath.png';
import rakibImage from '../app/images/Rakib Hasan.jpg';
import shadmanImage from '../app/images/Shadman Saleh.png';
import hero from '../app/images/hero section image.png'
// Helper components for the "multiverse" aesthetic
const MultiversePortal = ({ children, className }: {
  children: React.ReactNode,
  className?: string
}) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className={`relative z-10 p-6 rounded-3xl bg-gradient-to-br from-[#102D37]/30 to-[#13134D]/30 backdrop-blur-md shadow-[0_0_50px_rgba(25,45,54,0.5)] ${className}`}
  >
    <div className="absolute inset-0 rounded-3xl z-0 overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-transparent blur-3xl" />
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const SectionHeading = ({ children }: {
  children: React.ReactNode
}) => (
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="text-4xl md:text-5xl font-bold text-center mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
  >
    {children}
  </motion.h2>
);

const FloatingCard = ({ children, className, whileHoverProps = {} }: {
  children: React.ReactNode,
  className?: string,
  whileHoverProps?: any
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0, rotateX: -10 }}
    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
    whileHover={{ y: -10, scale: 1.05, rotateY: 3, rotateX: 3, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", ...whileHoverProps }}
    transition={{ type: "spring", stiffness: 100, damping: 10 }}
    viewport={{ once: true, amount: 0.3 }}
    className={`p-6 rounded-xl border border-white/10 bg-gradient-to-br from-[#192D36] to-[#13134D] shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-[length:200%_200%] bg-[100%_0%] animate-wave-shift opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
      style={{ backgroundImage: "linear-gradient(90deg, #102D37, #13134D, #102D37)" }} />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const AnimatedNumber = ({ value, duration = 2 }: {
  value: number,
  duration?: number
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5
  });
  const [currentValue, setCurrentValue] = useState(0);

  if (isInView && currentValue === 0) {
    const start = 0;
    const end = value;
    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.min(Math.floor(easedProgress * end), end);
      setCurrentValue(newCount);
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }

  return (
    <span ref={ref}>{currentValue.toLocaleString()}</span>
  );
};

const MockLineGraph = ({ data = [10, 25, 15, 40, 30, 50], color = "rgba(0, 255, 255, 0.5)" }) => {
  const maxValue = Math.max(...data) * 1.2;
  const path = `M0,${100 - (data[0] / maxValue) * 100} ` +
    data.slice(1).map((val, i) =>
      `L${((i + 1) / (data.length - 1)) * 100},${100 - (val / maxValue) * 100}`
    ).join(' ');

  const pathLength = 1000; // An arbitrary high number for the animation
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
        className="animate-draw"
      />
    </svg>
  );
};

const MockPieChart = ({ data = [20, 30, 50] }) => {
  const colors = ["#8B5CF6", "#EC4899", "#22D3EE"];
  let startAngle = 0;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((value, index) => {
        const endAngle = startAngle + (value / 100) * 360;
        const largeArcFlag = value > 50 ? 1 : 0;
        const x1 = 50 + 50 * Math.cos(startAngle * Math.PI / 180);
        const y1 = 50 + 50 * Math.sin(startAngle * Math.PI / 180);
        const x2 = 50 + 50 * Math.cos(endAngle * Math.PI / 180);
        const y2 = 50 + 50 * Math.sin(endAngle * Math.PI / 180);
        const pathData = `M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`;
        startAngle = endAngle;
        return (
          <path
            key={index}
            d={pathData}
            fill={colors[index]}
            className="origin-[50px_50px] animate-slice"
          />
        );
      })}
    </svg>
  );
};



const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`
      relative overflow-hidden rounded-3xl border border-white/[0.12]
      bg-white/5 backdrop-blur-3xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]
      before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
      before:bg-gradient-to-br before:from-white/[0.12] before:via-transparent before:to-transparent
      ${className}
    `}
  >
    <div className="p-8">
      {children}
    </div>
  </div>
);

const CardHeader = ({ children }: {children: React.ReactNode}) => <div className="space-y-2">{children}</div>;
const CardTitle = ({ children }: {children: React.ReactNode}) => <h3 className="text-3xl font-bold tracking-tight text-white">{children}</h3>;
const CardDescription = ({ children }: {children: React.ReactNode}) => <p className="text-lg text-gray-300/80 mt-1">{children}</p>;
const CardContent = ({ children }: {children: React.ReactNode}) => <div className="mt-6">{children}</div>;

// Example Usage
// <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen p-12">
//   <Card>
//     <CardHeader>
//       <CardTitle>Glassmorphism Card</CardTitle>
//       <CardDescription>A modern, elegant card with a frosted glass effect.</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <p className="text-white/90">This design uses backdrop-filter to create a beautiful transparent look.</p>
//     </CardContent>
//   </Card>
// </div>
const Button = ({ children, className, asChild, href, ...props }:  {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  href?: string;
  [key: string]: any;
}) => {
  if (asChild && !href) {
    console.warn('Button with asChild=true requires href prop');
    return <button className={className} {...props}>{children}</button>;
  }
  
  const Tag = asChild ? Link : 'button';
  return <Tag href={asChild && href ? href : "#"} className={className} {...props}>{children}</Tag>;
};
const Input = ({ className, ...props }: {
  className?: string,
  [key: string]: any
}) => <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
const Label = ({ children, className, ...props }: {
  children: React.ReactNode,
  className?: string,
  [key: string]: any
}) => <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>;

// Mock Icons to avoid react-icons dependency
const Icon = ({ path, color, size, className = "" }: {
  path: string,
  color: string,
  size: number,
  className?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    dangerouslySetInnerHTML={{ __html: path }}
  />
);

const FaRobot = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M12 2a10 10 0 0 0-9 15.68V22l4-1c2.1-1.3 4.4-2 7-2s4.9.7 7 2l4 1v-4.32A10 10 0 0 0 12 2zm-2 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-2 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />;
const FaBookOpen = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V7a4 4 0 0 1 4-4z" />;
const FaChartLine = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M16 11.3v8.7M8 17.3v2.7M12 14.3v5.7M20 7.3v12.7M4 19.3v-2.7" />;
const FaUsers = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M17 18h2a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2h2m2-8c1.1 0 2-.9 2-2V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5c0 1.1.9 2 2 2h4zm-5 4v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" />;
const FaStar = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 18.27l-6.18 3.27L7 14.14l-5-4.87 6.91-1.01L12 2z" />;
const FaQuestionCircle = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-4h-2V7h2v6z" />;
const FaLightbulb = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M12 2c-3.31 0-6 2.69-6 6a6 6 0 0 0 6 6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H7.81c.54-1.63 2.16-3 4.19-3 2.76 0 5 2.24 5 5 0 .55.45 1 1 1s1-.45 1-1c0-3.86-3.14-7-7-7zM8 21a2 2 0 0 0 4 0H8z" />;
const FaArrowRight = ({ size = 24, color = "currentColor" }) => <Icon size={size} color={color} path="M5 12h14m-7-7l7 7-7 7" />;

export default function FinolyLandingPage() {
  const [activeStory, setActiveStory] = useState(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showFaqCard, setShowFaqCard] = useState(false);

  const heroVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  };

 // Example Testimonial Data
const testimonials = [
  {
    name: "ব্যবহারকারী ১",
    review: "ফিনোলি আমার আর্থিক জীবনকে সম্পূর্ণরূপে বদলে দিয়েছে। আমি এখন আরও আত্মবিশ্বাসী।",
    icon: FaUserCircle,
    color: "from-blue-600 to-indigo-600"
  },
  {
    name: "ব্যবহারকারী ২",
    review: "এর গ্যামিফাইড লার্নিং ফিচারটি অসাধারণ, আর্থিক শিক্ষা এখন একটি মজার অভিজ্ঞতা।",
    icon: FaUserNinja,
    color: "from-purple-600 to-fuchsia-600"
  },
  {
    name: "ব্যবহারকারী ৩",
    review: "আমি আমার খরচগুলো ট্র্যাক করতে এবং বাজেট তৈরি করতে সক্ষম হয়েছি, যা আগে সম্ভব ছিল না।",
    icon: FaUserSecret,
    color: "from-cyan-600 to-teal-600"
  },
  {
    name: "ব্যবহারকারী ৪",
    review: "AI কোচ খুবই সহায়ক! এটি আমার সব প্রশ্নের দ্রুত এবং সঠিক উত্তর দেয়।",
    icon: FaUserTie,
    color: "from-rose-600 to-pink-600"
  },
];

const teamMembers = [
  {
    name: "সজিব ভট্টাচার্য",
    role: "মেশিন লার্নিং এক্সপার্ট",
    description: "মডেল প্রশিক্ষণ, ডেটা বিশ্লেষণ এবং এআই সলিউশন তৈরিতে নেতৃত্ব দেন।",
    image: sajibImage,
  },
  {
    name: "সৌরভ নাথ",
    role: "ডেভঅপস স্পেশালিস্ট",
    description: "সিস্টেমের নিরবচ্ছিন্ন কার্যকারিতা এবং ডেটা নিরাপত্তা নিশ্চিত করেন।",
    image: sowravImage,
  },
  {
    name: "রত্নজিৎ ধর",
    role: "কম্পিউটার ভিশন এক্সপার্ট",
    description: "কম্পিউটার ভিশন এবং ইমেজ প্রসেসিং সম্পর্কিত সব ধরনের প্রযুক্তিগত সমস্যার সমাধান করেন।",
    image: ratnajitImage,
  },
  {
    name: "মোঃ সাগর চৌধুরী",
    role: "প্রোগ্রামার এবং ডেভেলপার",
    description: "ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে নতুন কোড তৈরি এবং প্ল্যাটফর্মের বিকাশে কাজ করেন।",
    image: sagorImage,
  },
  {
    name: "মোঃ রাকিব হাসান",
    role: "এআই এক্সপার্ট",
    description: "এআই সিস্টেমের ডিজাইন এবং বাস্তবায়নে গুরুত্বপূর্ণ ভূমিকা পালন করেন।",
    image: rakibImage,
  },
  {
    name: "শাদমান সালেহ",
    role: "এমএলঅপস এক্সপার্ট",
    description: "মেশিন লার্নিং মডেলগুলোর জীবনচক্র পরিচালনা এবং স্বয়ংক্রিয় করতে কাজ করেন।",
    image: shadmanImage,
  },
];
  const faqs = [{
    q: "ফিনোলি কি আমার ডেটা সুরক্ষিত রাখে?",
    a: "হ্যাঁ, আপনার ডেটা সুরক্ষিত রাখতে আমরা সামরিক-গ্রেড এনক্রিপশন ব্যবহার করি। আপনার আর্থিক তথ্য সর্বোচ্চ নিরাপত্তা প্রোটোকলের মাধ্যমে সুরক্ষিত থাকে।",
  }, {
    q: "অ্যাপটি ব্যবহার করতে আমার কি আর্থিক জ্ঞান থাকা দরকার?",
    a: "না, একেবারেই না। ফিনোলি ডিজাইন করা হয়েছে সবার জন্য। আমাদের AI কোচ এবং গ্যামিফাইড লার্নিং টুলস আপনাকে শুরু থেকে শেষ পর্যন্ত পথ দেখাবে।",
  }, {
    q: "আমি কি একাধিক ব্যাংক অ্যাকাউন্ট যুক্ত করতে পারব?",
    a: "অবশ্যই। আপনি আপনার সব ব্যাংক অ্যাকাউন্ট, ক্রেডিট কার্ড এবং অন্যান্য আর্থিক উৎস একসাথে ফিনোলিতে সংযুক্ত করতে পারবেন।",
  }, {
    q: "অ্যাপটি কি বিনামূল্যে ব্যবহার করা যায়?",
    a: "আমাদের একটি ফ্রি প্ল্যান রয়েছে যা আপনাকে মৌলিক সুবিধাগুলো ব্যবহার করতে দেবে। আরও উন্নত ফিচার এবং গভীর অন্তর্দৃষ্টি পেতে আমাদের প্রিমিয়াম প্ল্যানগুলো দেখতে পারেন।",
  }, {
    q: "আমি কীভাবে শুরু করব?",
    a: "খুব সহজ! শুধু 'ড্যাশবোর্ডে যান' বাটনে ক্লিক করুন এবং আপনার অ্যাকাউন্টে সাইন আপ করুন। মাত্র কয়েক মিনিটের মধ্যে আপনি আপনার আর্থিক যাত্রা শুরু করতে পারবেন।",
  }, ];

  return (
    <main className="min-h-screen bg-[#192D36] text-white overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full animate-[spin_60s_linear_infinite] opacity-50">
          <div className="absolute top-[20%] left-[20%] w-4 h-4 rounded-full bg-cyan-400 blur-sm" />
          <div className="absolute bottom-[30%] right-[30%] w-6 h-6 rounded-full bg-purple-500 blur-md" />
          <div className="absolute top-[50%] right-[10%] w-3 h-3 rounded-full bg-pink-400 blur-sm" />
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-[size:200%_200%] animate-wave-bg pointer-events-none"
        style={{ backgroundImage: "linear-gradient(45deg, #192D36 0%, #13134D 50%, #192D36 100%)" }} />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#192D36]/50 backdrop-blur-md p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Finoly
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowFaqCard(true)}
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Faq
            </button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link href="/dashboard">
                Let's go
              </Link>
            </Button>
          </div>
        </div>
      </nav>

    <AnimatePresence>
      {showFaqCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowFaqCard(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FloatingCard className="relative p-8 max-w-2xl w-full">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                onClick={() => setShowFaqCard(false)}
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">সাধারণ প্রশ্ন</h2>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-700/50">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="flex items-center justify-between w-full text-left py-4 text-lg font-medium text-white hover:text-cyan-400 transition-colors"
                    >
                      {faq.q}
                      <motion.span
                        animate={{ rotate: activeFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-300 pb-4">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </FloatingCard>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

{/* Hero Section */}
<section className="relative min-h-screen flex items-center p-4 pt-24 text-center md:text-left overflow-hidden bg-gradient-to-br from-[#052F2F] via-[#0A2647] to-[#052F2F] pb-48">
  {/* Dynamic background effects with new colors */}
  <div className="absolute inset-0 z-0 bg-animated-gradient-deep-light opacity-70"></div>
  <div className="absolute inset-0 z-0 opacity-20">
    <div className="absolute top-[10%] left-[5%] w-6 h-6 rounded-full bg-blue-500 blur-xl animate-float" style={{ animationDelay: '0s' }} />
    <div className="absolute bottom-[20%] right-[15%] w-8 h-8 rounded-full bg-cyan-400 blur-xl animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute top-[40%] right-[5%] w-4 h-4 rounded-full bg-emerald-400 blur-lg animate-float" style={{ animationDelay: '4s' }} />
    <div className="absolute bottom-[5%] left-[25%] w-10 h-10 rounded-full bg-teal-400 blur-2xl animate-float" style={{ animationDelay: '6s' }} />
  </div>

  <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-6xl md:text-8xl font-black text-white mb-4 bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 to-purple-500"
      >
        স্বাগতম
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="text-2xl md:text-3xl font-bold mb-6 text-white"
      >
        শেখা, সঞ্চয় ও সচেতনতার মাল্টিভার্সে
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 lg:mx-0"
      >
        আপনার ব্যক্তিগত AI আর্থিক উপদেষ্টা। আধুনিক আর্থিক ব্যবস্থাপনা এবং শিক্ষার জন্য নির্মিত।
      </motion.p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 100 }}
      >
        <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          <Link href="/dashboard">
            🚀 ড্যাশবোর্ডে যান
          </Link>
        </Button>
      </motion.div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl">
          <div className="text-3xl font-bold text-cyan-400"><AnimatedNumber value={10000} />+</div>
          <p className="text-sm text-gray-300">ব্যবহারকারী</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.4 }} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl">
          <div className="text-3xl font-bold text-purple-400"><AnimatedNumber value={50} />%</div>
          <p className="text-sm text-gray-300">সঞ্চয় বৃদ্ধি</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.6 }} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl">
          <div className="text-3xl font-bold text-green-400"><AnimatedNumber value={98} />%</div>
          <p className="text-sm text-gray-300">সন্তুষ্টি</p>
        </motion.div>
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
      className="flex justify-center items-center w-full"
    >
      <Image
        src={hero}
        alt="AI Robot Teacher"
        className="w-full h-auto object-contain drop-shadow-lg"
      />
    </motion.div>
  </div>

  {/* Wavy bottom edge with increased carviness */}
  <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden z-20">
    <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M0,95 C30,120 70,30 100,60 L100,100 L0,100 Z"
        fill="#192D36" // This should match the next section's background for a seamless transition
      />
    </svg>
  </div>
</section>

{/* Custom CSS for the animated gradient background and float animation */}
<style jsx global>{`
  @keyframes animatedGradientDeepLight {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .bg-animated-gradient-deep-light {
    background: linear-gradient(-45deg, #001f3f, #004d40, #0a1a51, #003300, #00507a);
    background-size: 400% 400%;
    animation: animatedGradientDeepLight 15s ease infinite;
  }

  @keyframes float {
    0% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-5px) translateX(5px); }
    50% { transform: translateY(0px) translateX(0px); }
    75% { transform: translateY(5px) translateX(-5px); }
    100% { transform: translateY(0px) translateX(0px); }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
`}</style>

<div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />     {/* Video Demo Section */}
<div className="bg-[#102D37] py-20 relative overflow-hidden">
  <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="text-left"
    >
      <SectionHeading>আমাদের অ্যাপ দেখুন</SectionHeading>
      <p className="text-lg text-gray-300">
        ফিনোলির ইন্টারফেসটি ব্যবহার করা কতটা সহজ এবং স্বজ্ঞাত, তা এই ভিডিওতে দেখুন। আমাদের AI কোচ কীভাবে আপনার আর্থিক জীবনকে সহজ করে তোলে, তা বুঝতে পারবেন।
      </p>
    </motion.div>
    
    {/* Simple video without cards or complex containers */}
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-center"
    >
      <div className="w-full h-[500px] relative rounded-2xl overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/JQfphvNbR4E"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>


        
    </motion.div>
  </div>
</div>
      {/* Features Grid Section */}
      <div className="bg-[#192D36] py-20 relative">
        <div className="container mx-auto px-4">
          <SectionHeading>ফিনোলির অনন্য বৈশিষ্ট্য</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FloatingCard className="wave-shift-animation">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400"
                >
                  <FaRobot size={36} color="currentColor" />
                </motion.div>
                <CardTitle>AI আর্থিক কোচ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  আপনার ব্যক্তিগত AI উপদেষ্টা, যা আপনার আর্থিক প্রশ্নের উত্তর দেয়, বাজেট তৈরি করে এবং ব্যক্তিগত পরামর্শ প্রদান করে।
                </CardDescription>
              </CardContent>
            </FloatingCard>
            <FloatingCard className="wave-shift-animation">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400"
                >
                  <FaBookOpen size={36} color="currentColor" />
                </motion.div>
                <CardTitle>গ্যামিফাইড লার্নিং</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  লেভেল, লিডারবোর্ড এবং অর্জনযোগ্য লক্ষ্যগুলির মাধ্যমে আর্থিক শিক্ষা একটি মজাদার খেলায় পরিণত হয়।
                </CardDescription>
              </CardContent>
            </FloatingCard>
            <FloatingCard className="wave-shift-animation">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-500/20 text-green-400"
                >
                  <FaChartLine size={36} color="currentColor" />
                </motion.div>
                <CardTitle>আর্থিক ট্র্যাকার</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  আপনার ব্যয়, আয়, বাজেট এবং ব্যাংকিং লেনদেনের একটি পূর্ণাঙ্গ ওভারভিউ পান।
                </CardDescription>
              </CardContent>
            </FloatingCard>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />


{/* How It Works Section */}
<div className="bg-[#102D37] py-20 relative overflow-hidden">
  {/* Dynamic Background with Subtle Glow */}
  <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0f2d37] to-[#102D37]" />
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <SectionHeading>ফিনোলি কীভাবে কাজ করে</SectionHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
      {/* Vertical divider line */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-t from-transparent via-cyan-500/50 to-transparent" />
      
      {/* Map through the steps */}
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <div className="p-4 rounded-xl relative z-10">
              <h3 className="text-5xl font-black mb-4 text-cyan-400">0{step}</h3>
              <h4 className="text-2xl font-bold text-white mb-2">
                {step === 1 && "অ্যাকাউন্ট তৈরি করুন"}
                {step === 2 && "ডেটা সংযুক্ত করুন"}
                {step === 3 && "AI-এর সাথে শিখুন"}
                {step === 4 && "আর্থিক লক্ষ্য অর্জন করুন"}
              </h4>
              <p className="text-gray-300">
                {step === 1 && "অ্যাপটি ডাউনলোড করে আপনার আর্থিক মাল্টিভার্সে প্রবেশ করুন।"}
                {step === 2 && "সুরক্ষিতভাবে আপনার ব্যাংক অ্যাকাউন্টগুলো যুক্ত করুন।"}
                {step === 3 && "ব্যক্তিগতকৃত আর্থিক পরামর্শ পেতে AI কোচের সাথে চ্যাট করুন।"}
                {step === 4 && "ট্র্যাকার এবং গ্যামিফাইড লার্নিং ব্যবহার করে আপনার লক্ষ্য পূরণ করুন।"}
              </p>
            </div>
          </div>
          
          <div className="w-full h-40 md:h-full order-1 md:order-2 flex items-center justify-center p-4 relative group">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#192D36] to-[#13134D] shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              {/* This inner div gives the border a glowing effect on hover */}
              <div className="absolute inset-0 rounded-2xl p-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-[15px] bg-gradient-to-br from-cyan-400/80 via-transparent to-transparent animate-pulse" />
              </div>
            </div>
            
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {/* This is the container for the images or icons */}
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-700/50 group-hover:bg-cyan-500/20 transition-colors duration-300">
                {step === 1 && <FaUserPlus size={48} className="text-cyan-400" />}
                {step === 2 && <FaLink size={48} className="text-purple-400" />}
                {step === 3 && <FaBrain size={48} className="text-pink-400" />}
                {step === 4 && <FaTrophy size={48} className="text-green-400" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  {/* Benefits Section */}
<div className="bg-[#192D36] py-20 relative">
  <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <SectionHeading>কেন ফিনোলি বেছে নেবেন?</SectionHeading>
      <ul className="space-y-6 text-gray-300">
        <li className="flex items-start">
          <span className="mt-1 mr-4 flex-shrink-0">
            <FaLightbulb size={24} color="#22D3EE"  />
          </span>
          <span><strong className="text-white">স্মার্ট অন্তর্দৃষ্টি:</strong> আপনার ব্যয় অভ্যাসের উপর ভিত্তি করে ব্যক্তিগতকৃত পরামর্শ পান।</span>
        </li>
        <li className="flex items-start">
          <span className="mt-1 mr-4 flex-shrink-0">
            <FaUsers size={24} color="#8B5CF6"  />
          </span>
          <span><strong className="text-white">সম্প্রদায় সমর্থন:</strong> অন্যান্য ব্যবহারকারীদের সাথে সংযোগ স্থাপন করুন এবং অভিজ্ঞতা ভাগ করে নিন।</span>
        </li>
        <li className="flex items-start">
          <span className="mt-1 mr-4 flex-shrink-0">
            <FaStar size={24} color="#FACC15"  />
          </span>
          <span><strong className="text-white">সহজ ব্যবহার:</strong> সুন্দর এবং স্বজ্ঞাত ডিজাইন, যা আর্থিক ব্যবস্থাপনা সহজ করে তোলে।</span>
        </li>
        <li className="flex items-start">
          <span className="mt-1 mr-4 flex-shrink-0">
            <FaChartLine size={24} color="#4ADE80"  />
          </span>
          <span><strong className="text-white">সঞ্চয় বৃদ্ধি:</strong> কার্যকর বাজেট এবং ট্র্যাকিংয়ের মাধ্যমে আপনার সঞ্চয় বাড়ান।</span>
        </li>
      </ul>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="w-full h-80 bg-white/5 rounded-3xl p-6 flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/10"
    >
      {/* This is the placeholder for your image */}
      {/* You must import your image at the top of the file */}
      <div className="relative w-full h-full flex items-center justify-center">
        {
          
          <Image
            src={MG}
            alt="Benefit Section Image"
            layout="responsive"
            width={500}
            height={300}
            objectFit="contain"
          />
        }
      </div>
    </motion.div>
  </div>
</div>
<div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
 {/* Testimonials Section */}
<div className="bg-gray-950 py-20 relative overflow-hidden">
  {/* Dynamic Background */}
  <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#050D24] via-transparent to-transparent" />
    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500/10 blur-[150px] animate-pulse-slow delay-500" />
    <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow" />
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <SectionHeading>ব্যবহারকারীদের মতামত</SectionHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {testimonials.map((testimonial, i) => (
        <FloatingCard
          key={i}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-gray-600 text-white font-bold transition-transform duration-300 hover:scale-110">
              <testimonial.icon size={36} />
            </div>
            <div>
              <h4 className="font-bold text-white">{testimonial.name}</h4>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} color="currentColor" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-300">
            "{testimonial.review}"
          </p>
        </FloatingCard>
      ))}
    </div>
  </div>
</div>
<div className="bg-[#102D37] py-20 relative">
  <div className="container mx-auto px-4">
    <SectionHeading>আমাদের দল</SectionHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, i) => (
        <FloatingCard key={i} whileHoverProps={{ rotateY: 3, rotateX: 3 }}>
          <div className="flex flex-col items-center text-center">
            {/* Increased image size from w-24 h-24 to w-36 h-36 */}
            <div className="w-36 h-36 rounded-full overflow-hidden mb-4 border-2 border-cyan-400/50 relative">
              <Image
                src={member.image}
                alt={member.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3> {/* Slightly increased text size for better balance */}
            <p className="text-base text-gray-400">{member.role}</p> {/* Slightly increased text size */}
            <p className="text-gray-300 mt-2 text-base"> {/* Slightly increased text size */}
              {member.description}
            </p>
          </div>
        </FloatingCard>
      ))}
    </div>
  </div>
</div>
      {/* Final CTA */}
<div className="bg-[#192D36] py-20 relative overflow-hidden">
  <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="text-left"
    >
      <SectionHeading>এখনই শুরু করুন</SectionHeading>
      <p className="text-lg text-gray-300 mb-8">
        আপনার আর্থিক মাল্টিভার্স অন্বেষণের যাত্রা শুরু করতে আর অপেক্ষা নয়।
      </p>
      <a
        href="#" // Replace with your intended link (e.g., to a download page or a contact form)
        className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        আপনার যাত্রা শুরু করুন
      </a>
      <div className="mt-8 flex justify-center md:justify-start space-x-4">
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">
            <FaStar size={16} color="#FACC15"  />
          </span>
          <span>নিরাপদ এবং সুরক্ষিত</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">
            <FaQuestionCircle size={16} color="#22D3EE"  />
          </span>
          <span>24/7 সমর্থন</span>
        </div>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="w-full h-80 bg-white/5 rounded-3xl p-6 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:bg-white/10"
    >
      {/* This is a placeholder for your image or icon. 
        Replace this div with your img tag.
      */}
  
<div className="w-full h-full rounded-2xl relative flex items-center justify-center text-white overflow-hidden">
  <Image
    src={heroImg}
    alt="Hero"
    fill
    className="object-cover"
  />
  
</div>

    </motion.div>
  </div>
</div>

      <Footer/>
    </main>
  );
}