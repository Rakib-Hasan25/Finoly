'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, X, Minimize2 } from 'lucide-react';

export function FloatingChatDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hello! I\'m your AI Financial Coach. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your question about "${message}". As your AI Financial Coach, I'd be happy to help you with financial planning, budgeting, or any other financial concerns you might have. Could you please provide more specific details about what you'd like to know?`,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Floating Chat Button Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Floating button with smooth animations
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Expandable chat popup
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Minimizable interface
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Responsive design
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Theme color integration
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">How to Use</h2>
              <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Click the floating chat button in the bottom-right corner</li>
                <li>Type your financial question in the chat input</li>
                <li>Receive personalized advice from your AI coach</li>
                <li>Minimize or close the chat as needed</li>
              </ol>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Live Preview</h2>
            <p className="text-gray-400 mb-4">
              This is a demo of the floating chat button. The actual implementation is integrated into the tracker page.
            </p>
            
            <div className="relative h-96 bg-slate-900 rounded-lg border border-slate-600 overflow-hidden">
              {/* Simulated chat interface */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI আর্থিক কোচ</h3>
                    <p className="text-xs text-green-100">আপনার ব্যক্তিগত আর্থিক উপদেষ্টা</p>
                  </div>
                </div>
              </div>

              <div className="p-4 h-64 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-green-500 text-slate-900'
                        : 'bg-slate-700 border border-slate-600 text-gray-200'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 bg-slate-700 rounded-2xl px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-300">AI চিন্তা করছে...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-600 bg-slate-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="আপনার AI আর্থিক কোচকে যেকোনো কিছু জিজ্ঞাসা করুন..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    পাঠান
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <MessageCircle className="w-8 h-8 text-white mx-auto" />
      </motion.button>

      {/* Chat Popup */}
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            height: isMinimized ? '80px' : '500px'
          }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI আর্থিক কোচ</h3>
                  <p className="text-xs text-green-100">
                    {isLoading ? 'টাইপ করছে...' : 'আপনার ব্যক্তিগত আর্থিক উপদেষ্টা'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isMinimized && (
                  <button
                    onClick={minimizeChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 h-[380px] overflow-y-auto p-4 space-y-3 bg-slate-900/50">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-200 mb-2">আপনার AI কোচে স্বাগতম!</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      বাজেটিং, সঞ্চয়, বিনিয়োগ বা আর্থিক পরিকল্পনা সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-green-500 text-slate-900'
                          : 'bg-slate-700 border border-slate-600 text-gray-200'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 bg-slate-700/50 rounded-2xl px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-300">AI চিন্তা করছে...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="আপনার AI আর্থিক কোচকে যেকোনো কিছু জিজ্ঞাসা করুন..."
                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-green-500/20"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    পাঠান
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
