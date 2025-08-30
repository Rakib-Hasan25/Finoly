# Chat Components

This directory contains all the chat-related components for the AI Financial Coach feature.

## Components

### FloatingChatButton
A floating action button that appears in the bottom-right corner of the tracker page. When clicked, it opens a chat popup with the AI Financial Coach.

**Features:**
- Floating button with smooth animations
- Expandable chat popup
- Minimizable chat interface
- Responsive design
- Matches the app's theme colors

**Usage:**
```tsx
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';

// Add to your page component
<FloatingChatButton />
```

### FinancialCoachChat
Full-screen chat interface with sidebar navigation for chat history.

### ChatInterface
Main chat display area with message history and input.

### ChatInput
Input component for sending messages to the AI coach.

### ChatMessage
Individual message display component.

### ChatHistory
Sidebar component showing chat history and navigation.

## Theme Integration

The chat components use the app's primary theme colors:
- Primary: `rgb(87, 204, 2)` (Green)
- Background: Dark slate colors
- Accent: Green gradients and highlights

## API Integration

Chat functionality is powered by the `/api/chat` endpoint which integrates with OpenAI's GPT models to provide intelligent financial advice.

## Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Floating button always accessible
- Popup chat adapts to screen size
