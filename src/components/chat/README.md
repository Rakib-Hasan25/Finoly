# Financial Coach Chatbot

A beautiful, feature-rich chatbot interface for the Financial Coach page with the following capabilities:

## Features

### 🗂️ Chat History Management
- **Persistent Storage**: All chat conversations are stored in localStorage
- **Chat Sessions**: Each conversation is saved as a separate session
- **Auto-save**: Messages are automatically saved as you type
- **Session Titles**: Chat titles are automatically generated from the first user message

### 💬 Chat Interface
- **Real-time Chat**: Send messages and receive AI responses
- **Message Types**: Clear distinction between user and AI messages
- **Loading States**: Beautiful loading animations while AI is thinking
- **Auto-scroll**: Automatically scrolls to the latest message
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 🎨 Beautiful UI
- **Modern Design**: Clean, professional interface with your brand colors
- **Smooth Animations**: Elegant transitions and hover effects
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper contrast and keyboard navigation

### 📱 Mobile Experience
- **Collapsible Sidebar**: Chat history can be hidden on mobile
- **Touch-friendly**: Optimized for touch devices
- **Overlay Navigation**: Smooth mobile navigation experience

## Components

### `FinancialCoachChat`
Main component that orchestrates the entire chatbot experience.

### `ChatHistory`
Sidebar component showing all chat sessions with options to:
- View chat history
- Start new conversations
- Delete individual chats
- Clear all chats

### `ChatInterface`
Main chat area displaying:
- Chat header with AI coach info
- Message history
- Loading indicators
- Chat input

### `ChatMessage`
Individual message component with:
- User/AI message styling
- Timestamps
- Avatar indicators
- Proper message formatting

### `ChatInput`
Input component with:
- Message input field
- Send button
- Loading states
- Keyboard shortcuts (Enter to send)

## Usage

The chatbot automatically:
1. Creates a new chat session when first loaded
2. Loads previous chat history from localStorage
3. Saves all conversations automatically
4. Provides default welcome messages for new chats

## Customization

### Colors
The chatbot uses your existing color scheme:
- Primary: `rgb(87,204,2)` (green)
- Background: `rgb(15,25,35)` (dark)
- Secondary: `rgb(25,45,54)` (lighter dark)

### AI Responses
Currently uses a simple response generator. Replace the `generateAIResponse` function in `useChat.ts` with your actual AI API integration.

### Storage
Uses localStorage by default. Can be easily modified to use your database or other storage solutions.

## Future Enhancements

- **Real AI Integration**: Connect to OpenAI, Claude, or other AI services
- **File Uploads**: Allow users to upload financial documents
- **Voice Chat**: Add voice input/output capabilities
- **Multi-language**: Support for different languages
- **Analytics**: Track chat usage and user engagement
- **Export**: Allow users to export chat history
