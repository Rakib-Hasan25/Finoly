import { ChatMessage, ChatSession, ChatHistoryItem } from '../../tracker-types/chat';

const CHAT_HISTORY_KEY = 'finoly_chat_history';
const CHAT_MESSAGES_KEY = 'finoly_chat_messages';

export class ChatStorage {
  // Get all chat sessions
  static getChatHistory(): ChatHistoryItem[] {
    try {
      const stored = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!stored) return [];
      
      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error reading chat history:', error);
      return [];
    }
  }

  // Get messages for a specific chat
  static getChatMessages(chatId: string): ChatMessage[] {
    try {
      const stored = localStorage.getItem(`${CHAT_MESSAGES_KEY}_${chatId}`);
      if (!stored) return [];
      
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error reading chat messages:', error);
      return [];
    }
  }

  // Save messages for a specific chat
  static saveChatMessages(chatId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(`${CHAT_MESSAGES_KEY}_${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }

  // Save chat history
  static saveChatHistory(history: ChatHistoryItem[]): void {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  // Add a new chat session
  static addChatSession(session: ChatHistoryItem): void {
    const history = this.getChatHistory();
    const existingIndex = history.findIndex(h => h.id === session.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = session;
    } else {
      history.unshift(session);
    }
    
    this.saveChatHistory(history);
  }

  // Update chat session
  static updateChatSession(session: ChatHistoryItem): void {
    const history = this.getChatHistory();
    const index = history.findIndex(h => h.id === session.id);
    
    if (index >= 0) {
      history[index] = session;
      this.saveChatHistory(history);
    }
  }

  // Delete a chat session
  static deleteChatSession(chatId: string): void {
    const history = this.getChatHistory().filter(h => h.id !== chatId);
    this.saveChatHistory(history);
    localStorage.removeItem(`${CHAT_MESSAGES_KEY}_${chatId}`);
  }

  // Clear all chat data
  static clearAllChats(): void {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    
    // Remove all message keys
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CHAT_MESSAGES_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
}
