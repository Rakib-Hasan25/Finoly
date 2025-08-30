import { useState, useEffect } from 'react';
import { ChatHistory } from './ChatHistory';
import { ChatInterface } from './ChatInterface';
import { useChat } from '../../hooks/useChat';
import { Menu, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export function FinancialCoachChat() {
  const {
    currentChatId,
    messages,
    isLoading,
    error,
    chatHistory,
    loadChat,
    createNewChat,
    sendMessage,
    deleteChat,
    clearAllChats
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showError, setShowError] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-create first chat if none exists
  useEffect(() => {
    if (chatHistory.length === 0 && !currentChatId) {
      // Small delay to ensure smooth loading
      const timer = setTimeout(() => {
        createNewChat();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chatHistory.length, currentChatId, createNewChat]);

  // Handle error display
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChatSelect = (chatId: string) => {
    loadChat(chatId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const sidebarWidth = isSidebarCollapsed ? 'w-16' : 'w-80';

  return (
    <div className="h-screen bg-[rgb(15,25,35)] flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden bg-[rgb(25,45,54)] border-b border-[rgb(87,204,2)]/20 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[rgb(87,204,2)]">আর্থিক কোচ</h1>
            <button
              onClick={toggleSidebar}
              className="p-2 text-[rgb(87,204,2)] hover:bg-[rgb(87,204,2)]/20 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${
            isMobile ? 'absolute z-50 h-full shadow-2xl' : 'relative'
          } transition-all duration-300 ease-in-out ${sidebarWidth} ${
            isMobile ? 'w-80' : ''
          }`}
        >
          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 z-10 w-6 h-6 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-full flex items-center justify-center hover:bg-[rgb(87,204,2)]/90 transition-colors shadow-lg hover:scale-110"
              title={isSidebarCollapsed ? "সাইডবার প্রসারিত করুন" : "সাইডবার সংকুচিত করুন"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          <ChatHistory
            chatHistory={chatHistory}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onDeleteChat={deleteChat}
            onClearAll={clearAllChats}
            isCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {currentChatId ? (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onToggleSidebar={isMobile ? toggleSidebar : undefined}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[rgb(15,25,35)]">
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgb(87,204,2)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-[rgb(87,204,2)] rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">একটি চ্যাট নির্বাচন করুন</h3>
                <p className="text-gray-400 mb-4">একটি বিদ্যমান কথোপকথন নির্বাচন করুন বা একটি নতুন শুরু করুন</p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/90 transition-colors"
                >
                  নতুন চ্যাট শুরু করুন
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Enhanced Error Display */}
      {showError && error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">ত্রুটি</h4>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
