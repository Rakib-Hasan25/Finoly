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
        content: "Hello! I'm your AI Financial Coach. I'm here to help you with personalized financial advice, budgeting tips, investment strategies, and debt management. How can I assist you today?",
        role: 'assistant',
        timestamp: new Date(),
        chatId: newChatId
      },
      {
        id: `msg_${Date.now()}_2`,
        content: "You can ask me about:\n• Creating and sticking to a budget\n• Building an emergency fund\n• Investment strategies\n• Debt reduction plans\n• Saving for specific goals\n• Understanding financial products",
        role: 'assistant',
        timestamp: new Date(),
        chatId: newChatId
      }
    ];

    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'New Chat',
      preview: 'Start a new financial conversation',
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
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (response.status === 500 && errorData.error?.includes('API key')) {
          errorMessage = 'OpenAI API key not configured. Please check your environment variables.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again in a few minutes.';
        } else if (response.status >= 400) {
          errorMessage = 'Request error. Please check your message and try again.';
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
      let errorMessage = 'Failed to get response. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
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
