import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Validate request
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { messages, systemPrompt } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400 }
      );
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content || typeof message.content !== 'string') {
        return NextResponse.json(
          { error: 'Invalid message format. Each message must have role and content.' },
          { status: 400 }
        );
      }
      
      if (!['user', 'assistant', 'system'].includes(message.role)) {
        return NextResponse.json(
          { error: 'Invalid message role. Must be user, assistant, or system.' },
          { status: 400 }
        );
      }
    }

    // Prepare messages for OpenAI API
    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt || `You are a knowledgeable and friendly AI Financial Coach. Your role is to provide personalized financial advice, budgeting tips, investment strategies, and debt management guidance. 

Key principles to follow:
- Always provide practical, actionable advice
- Consider the user's financial situation and goals
- Explain complex financial concepts in simple terms
- Encourage good financial habits and long-term thinking
- Be supportive and non-judgmental
- When appropriate, suggest consulting with licensed financial professionals for complex matters
- Focus on education and empowerment rather than just giving answers

Remember to:
- Ask clarifying questions when needed
- Provide step-by-step guidance for complex topics
- Share relevant examples and analogies
- Encourage setting specific, measurable financial goals
- Emphasize the importance of emergency funds and insurance
- Discuss both short-term and long-term financial planning

Keep responses conversational, helpful, and focused on the user's specific question.`
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: aiResponse,
      usage: completion.usage 
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error instanceof OpenAI.APIError) {
      // Handle specific OpenAI API errors
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key.' },
          { status: 401 }
        );
      }
      
      if (error.status === 402) {
        return NextResponse.json(
          { error: 'Payment required. Please check your OpenAI account billing.' },
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
