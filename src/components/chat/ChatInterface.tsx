import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatDemo } from './ChatDemo';
import { ChatMessage as ChatMessageType } from '../../tracker-types/chat';
import { Bot, User, Menu } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onToggleSidebar?: () => void;
}

export function ChatInterface({ 
  messages, 
  isLoading, 
  onSendMessage, 
  disabled,
  onToggleSidebar 
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    onSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full bg-[rgb(15,25,35)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-[rgb(87,204,2)]/20 bg-[rgb(25,45,54)]">
        <div className="flex items-center gap-3">
          {/* Mobile Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-[rgb(87,204,2)] hover:bg-[rgb(87,204,2)]/20 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="w-10 h-10 bg-[rgb(87,204,2)] rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-[rgb(25,45,54)]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[rgb(87,204,2)]">AI Financial Coach</h2>
            <p className="text-sm text-gray-400">
              {isLoading ? 'Typing...' : 'Your personal financial advisor'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[rgb(87,204,2)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-[rgb(87,204,2)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">Welcome to Financial Coach!</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                I'm here to help you with personalized financial advice, budgeting tips, 
                investment strategies, and debt management. Start by asking me a question!
              </p>
            </div>
            
            {/* Sample Questions Demo */}
            <ChatDemo onQuestionClick={handleQuestionClick} />
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {/* Enhanced Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-full flex items-center justify-center">
                <span className="text-[rgb(87,204,2)] text-sm font-bold">AI</span>
              </div>
              <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[rgb(87,204,2)] text-sm">AI is thinking</span>
                    <div className="flex gap-1 ml-2">
                      <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[rgb(87,204,2)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        disabled={disabled}
      />
    </div>
  );
}
