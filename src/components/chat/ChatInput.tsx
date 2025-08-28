import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isMessageValid = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-[rgb(87,204,2)]/20 bg-[rgb(25,45,54)] p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI Financial Coach anything..."
            className="w-full min-h-[44px] max-h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(87,204,2)] focus:border-transparent transition-all"
            disabled={isLoading || disabled}
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '128px'
            }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {message.length}/1000
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!isMessageValid}
          className={`p-3 rounded-lg transition-all duration-200 ${
            isMessageValid
              ? 'bg-[rgb(87,204,2)] text-[rgb(25,45,54)] hover:bg-[rgb(87,204,2)]/90 hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          title={isMessageValid ? 'Send message' : 'Type a message to send'}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Help text */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
