'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bot, Send, Minimize2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useChat } from '../../hooks/useChat';
import { ChatMessage as ChatMessageType } from '../../tracker-types/chat';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const {
    currentChatId,
    messages,
    isLoading,
    sendMessage,
    createNewChat
  } = useChat();

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    if (!currentChatId) {
      createNewChat();
    }
    sendMessage(message.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      if (!currentChatId) {
        createNewChat();
      }
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Floating Button */}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 h-[520px] bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '80px' : '520px'
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
                <div className="flex-1 h-[320px] overflow-y-auto p-4 space-y-3 bg-slate-900/50">
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
                      <ChatMessage key={message.id} message={message} />
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

                {/* Input Area - Custom implementation to fix overflow */}
                <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="আপনার AI আর্থিক কোচকে যেকোনো কিছু জিজ্ঞাসা করুন..."
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-green-500/20 text-sm"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isLoading}
                      className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                        inputValue.trim() && !isLoading
                          ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                          : 'bg-slate-600 text-gray-400 cursor-not-allowed'
                      }`}
                      title="বার্তা পাঠান"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Help text */}
                  <div className="mt-1 text-xs text-gray-500 text-center">
                    পাঠানোর জন্য Enter চাপুন
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
