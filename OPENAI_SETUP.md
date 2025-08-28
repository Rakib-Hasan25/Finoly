# OpenAI API Setup for Financial Coach Chat

## Prerequisites
- An OpenAI account with API access
- An OpenAI API key

## Setup Steps

### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Create a new API key
5. Copy the API key (keep it secure!)

### 2. Configure Environment Variables
Create a `.env.local` file in your project root directory:

```bash
# .env.local
OPENAI_API_KEY=your_actual_api_key_here
```

**Important:** 
- Never commit this file to version control
- The `.env.local` file is already in `.gitignore`
- Replace `your_actual_api_key_here` with your real API key

### 3. Restart Your Development Server
After creating the `.env.local` file, restart your Next.js development server:

```bash
pnpm dev
```

## Features

The Financial Coach Chat now includes:
- ✅ Real AI responses using OpenAI GPT-3.5-turbo
- ✅ Persistent chat history stored in browser localStorage
- ✅ Financial coaching system prompt for relevant advice
- ✅ Error handling for API failures
- ✅ Loading states during API calls

## Usage

1. Navigate to `/dashboard/financial-coach`
2. Start a new chat or continue an existing conversation
3. Ask financial questions about:
   - Budgeting and spending
   - Emergency funds and savings
   - Investment strategies
   - Debt management
   - Financial goal setting
   - Credit scores and credit management

## Troubleshooting

### API Key Not Configured Error
- Ensure your `.env.local` file exists and contains the correct API key
- Check that the API key is valid and has sufficient credits
- Restart your development server after making changes

### Rate Limiting
- OpenAI has rate limits on API calls
- Free tier users have lower limits than paid users
- Consider upgrading your OpenAI plan if you hit limits frequently

### Network Issues
- Check your internet connection
- Ensure your firewall isn't blocking the OpenAI API
- Try again in a few minutes if the issue persists

## Security Notes

- API keys are only used server-side in API routes
- Client-side code never sees your API key
- All chat messages are processed through secure API endpoints
- Chat history is stored locally in your browser
