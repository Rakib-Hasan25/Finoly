import { ChatMessage as ChatMessageType } from '../../tracker-types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-[rgb(87,204,2)] text-[rgb(25,45,54)]'
              : 'bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 text-gray-200'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>
      
      {/* {!isUser && (
        <div className="order-2 ml-3">
          <div className="w-8 h-8 bg-[rgb(87,204,2)] rounded-full flex items-center justify-center">
            <span className="text-[rgb(25,45,54)] text-sm font-bold">AI</span>
          </div>
        </div>
      )}
      
      {isUser && (
        <div className="order-1 mr-3">
          <div className="w-8 h-8 bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-full flex items-center justify-center">
            <span className="text-[rgb(87,204,2)] text-sm font-bold">U</span>
          </div>
        </div>
      )} */}
    </div>
  );
}
