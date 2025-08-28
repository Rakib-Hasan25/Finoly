import { ChatHistoryItem } from '../../tracker-types/chat';
import { Plus, Trash2, MessageSquare, Clock, MoreVertical, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ChatHistoryProps {
  chatHistory: ChatHistoryItem[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onClearAll: () => void;
  isCollapsed?: boolean;
}

export function ChatHistory({
  chatHistory,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onClearAll,
  isCollapsed = false
}: ChatHistoryProps) {
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleDelete = (chatId: string) => {
    onDeleteChat(chatId);
    setShowMenu(null);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-[rgb(25,45,54)] border-r border-[rgb(87,204,2)]/20 flex flex-col h-full">
        {/* Collapsed Header */}
        <div className="p-2 border-b border-[rgb(87,204,2)]/20">
          <button
            onClick={onNewChat}
            className="w-12 h-12 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-lg hover:bg-[rgb(87,204,2)]/90 transition-colors flex items-center justify-center"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsed Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {chatHistory.length === 0 ? (
            <div className="text-center py-4">
              <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.slice(0, 8).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-12 h-12 rounded-lg transition-all flex items-center justify-center relative ${
                    currentChatId === chat.id
                      ? 'bg-[rgb(87,204,2)]/20 border border-[rgb(87,204,2)]/40'
                      : 'hover:bg-gray-700/50'
                  }`}
                  title={chat.title}
                >
                  <MessageCircle className="w-5 h-5 text-gray-300" />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[rgb(25,45,54)] border-r border-[rgb(87,204,2)]/20 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[rgb(87,204,2)]/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[rgb(87,204,2)]">Chat History</h2>
          <button
            onClick={onNewChat}
            className="p-2 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-lg hover:bg-[rgb(87,204,2)]/90 transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {chatHistory.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear all chats
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No chat history yet</p>
            <button
              onClick={onNewChat}
              className="px-4 py-2 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/90 transition-colors"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="p-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`group relative mb-2 rounded-lg p-3 cursor-pointer transition-all ${
                  currentChatId === chat.id
                    ? 'bg-[rgb(87,204,2)]/20 border border-[rgb(87,204,2)]/40'
                    : 'hover:bg-gray-700/50'
                }`}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-200 truncate mb-1">
                      {chat.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate mb-2">
                      {chat.preview}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === chat.id ? null : chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Delete Menu */}
                {showMenu === chat.id && (
                  <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
