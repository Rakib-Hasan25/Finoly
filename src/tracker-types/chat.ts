export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  chatId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export interface ChatState {
  currentChatId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  unreadCount: number;
}
