import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatHistoryItem, ChatState } from '../tracker-types/chat';
import { ChatStorage } from '../lib-tracker/chatStorage';

export function useChat() {
  const [state, setState] = useState<ChatState>({
    currentChatId: null,
    messages: [],
    isLoading: false,
    error: null
  });

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  // Load chat history on mount
  useEffect(() => {
    const history = ChatStorage.getChatHistory();
    setChatHistory(history);
  }, []);

  // Load messages for current chat
  const loadChat = useCallback((chatId: string) => {
    const messages = ChatStorage.getChatMessages(chatId);
    setState(prev => ({
      ...prev,
      currentChatId: chatId,
      messages,
      error: null
    }));
  }, []);

  // Create new chat
  const createNewChat = useCallback(() => {
    const newChatId = `chat_${Date.now()}`;
    const defaultMessages: ChatMessage[] = [
      {
        id: `msg_${Date.now()}_1`,
        content: "হ্যালো! আমি আপনার AI আর্থিক কোচ। আমি ব্যক্তিগতকৃত আর্থিক পরামর্শ, বাজেটিং টিপস, বিনিয়োগ কৌশল এবং ঋণ ব্যবস্থাপনায় আপনাকে সাহায্য করতে এখানে আছি। আজ আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
        role: 'assistant',
        timestamp: new Date(),
        chatId: newChatId
      },
      {
        id: `msg_${Date.now()}_2`,
        content: "আপনি আমাকে জিজ্ঞাসা করতে পারেন:\n• বাজেট তৈরি করা এবং মেনে চলা\n• জরুরি তহবিল গড়ে তোলা\n• বিনিয়োগ কৌশল\n• ঋণ হ্রাস পরিকল্পনা\n• নির্দিষ্ট লক্ষ্যের জন্য সঞ্চয়\n• আর্থিক পণ্য বোঝা\n• সঞ্চয় পরিকল্পনা\n• বীমা সম্পর্কিত পরামর্শ",
        role: 'assistant',
        timestamp: new Date(),
        chatId: newChatId
      }
    ];

    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'নতুন চ্যাট',
      preview: 'একটি নতুন আর্থিক কথোপকথন শুরু করুন',
      timestamp: new Date(),
      unreadCount: 0
    };

    ChatStorage.saveChatMessages(newChatId, defaultMessages);
    ChatStorage.addChatSession(newChat);
    
    setChatHistory(prev => [newChat, ...prev]);
    setState(prev => ({
      ...prev,
      currentChatId: newChatId,
      messages: defaultMessages,
      error: null
    }));
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!state.currentChatId || !content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      chatId: state.currentChatId
    };

    const updatedMessages = [...state.messages, userMessage];
    
    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      isLoading: true,
      error: null
    }));

    // Save user message
    ChatStorage.saveChatMessages(state.currentChatId, updatedMessages);

    try {
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Failed to get response from AI';
        
        // Handle specific error cases
        if (response.status === 429) {
          errorMessage = 'হার সীমা অতিক্রম করেছে। অনুগ্রহ করে একটু অপেক্ষা করে আবার চেষ্টা করুন।';
        } else if (response.status === 500 && errorData.error?.includes('API key')) {
          errorMessage = 'OpenAI API কী কনফিগার করা নেই। অনুগ্রহ করে আপনার environment variables পরীক্ষা করুন।';
        } else if (response.status >= 500) {
          errorMessage = 'সার্ভার ত্রুটি। অনুগ্রহ করে কয়েক মিনিট পরে আবার চেষ্টা করুন।';
        } else if (response.status >= 400) {
          errorMessage = 'অনুরোধ ত্রুটি। অনুগ্রহ করে আপনার বার্তা পরীক্ষা করে আবার চেষ্টা করুন।';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        chatId: state.currentChatId
      };

      const finalMessages = [...updatedMessages, aiResponse];
      
      setState(prev => ({
        ...prev,
        messages: finalMessages,
        isLoading: false
      }));

      // Save AI response
      ChatStorage.saveChatMessages(state.currentChatId, finalMessages);

      // Update chat history
      const updatedChat: ChatHistoryItem = {
        id: state.currentChatId,
        title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
        preview: aiResponse.content.length > 50 ? `${aiResponse.content.substring(0, 50)}...` : aiResponse.content,
        timestamp: new Date(),
        unreadCount: 0
      };

      ChatStorage.updateChatSession(updatedChat);
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === state.currentChatId ? updatedChat : chat
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle network errors specifically
      let errorMessage = 'উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
      
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [state.currentChatId, state.messages]);

  // Delete chat
  const deleteChat = useCallback((chatId: string) => {
    ChatStorage.deleteChatSession(chatId);
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    if (state.currentChatId === chatId) {
      setState(prev => ({
        ...prev,
        currentChatId: null,
        messages: []
      }));
    }
  }, [state.currentChatId]);

  // Clear all chats
  const clearAllChats = useCallback(() => {
    ChatStorage.clearAllChats();
    setChatHistory([]);
    setState(prev => ({
      ...prev,
      currentChatId: null,
      messages: []
    }));
  }, []);

  return {
    ...state,
    chatHistory,
    loadChat,
    createNewChat,
    sendMessage,
    deleteChat,
    clearAllChats
  };
}
