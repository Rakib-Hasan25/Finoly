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
        { error: 'অনুরোধের body প্রয়োজন' },
        { status: 400 }
      );
    }

    const { messages, systemPrompt } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API কী কনফিগার করা নেই। অনুগ্রহ করে আপনার environment variables পরীক্ষা করুন।' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'বার্তার array প্রয়োজন' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'কমপক্ষে একটি বার্তা প্রয়োজন' },
        { status: 400 }
      );
    }

    // Validate message format
    for (const message of messages) {
      if (!message.role || !message.content || typeof message.content !== 'string') {
        return NextResponse.json(
          { error: 'অবৈধ বার্তার ফরম্যাট। প্রতিটি বার্তায় role এবং content থাকতে হবে।' },
          { status: 400 }
        );
      }
      
      if (!['user', 'assistant', 'system'].includes(message.role)) {
        return NextResponse.json(
          { error: 'অবৈধ বার্তার role। user, assistant, বা system হতে হবে।' },
          { status: 400 }
        );
      }
    }

    // Prepare messages for OpenAI API
    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt || `আপনি একজন জ্ঞানী এবং বন্ধুত্বপূর্ণ AI আর্থিক কোচ। আপনার ভূমিকা হল ব্যক্তিগতকৃত আর্থিক পরামর্শ, বাজেটিং টিপস, বিনিয়োগ কৌশল এবং ঋণ ব্যবস্থাপনার নির্দেশনা প্রদান করা।

**গুরুত্বপূর্ণ নিয়ম: আপনি কখনও ইংরেজিতে উত্তর দিবেন না। সর্বদা এবং শুধুমাত্র বাংলায় উত্তর দিতে হবে।**

মূল নীতি যা অনুসরণ করতে হবে:
- সর্বদা ব্যবহারিক, কার্যকরী পরামর্শ প্রদান করুন
- ব্যবহারকারীর আর্থিক অবস্থা এবং লক্ষ্যগুলি বিবেচনা করুন
- জটিল আর্থিক ধারণাগুলি সহজ শব্দে ব্যাখ্যা করুন
- ভাল আর্থিক অভ্যাস এবং দীর্ঘমেয়াদী চিন্তাভাবনা উৎসাহিত করুন
- সহায়ক এবং বিচারমূলক নয় হন
- যখন উপযুক্ত হয়, জটিল বিষয়গুলির জন্য লাইসেন্সপ্রাপ্ত আর্থিক পেশাদারদের সাথে পরামর্শ করার পরামর্শ দিন
- শুধু উত্তর দেওয়ার পরিবর্তে শিক্ষা এবং ক্ষমতায়নের উপর ফোকাস করুন

মনে রাখবেন:
- যখন প্রয়োজন হয় তখন স্পষ্টীকরণের প্রশ্ন জিজ্ঞাসা করুন
- জটিল বিষয়গুলির জন্য ধাপে ধাপে নির্দেশনা প্রদান করুন
- প্রাসঙ্গিক উদাহরণ এবং উপমা শেয়ার করুন
- নির্দিষ্ট, পরিমাপযোগ্য আর্থিক লক্ষ্য নির্ধারণে উৎসাহিত করুন
- জরুরি তহবিল এবং বীমার গুরুত্ব জোর দিন
- স্বল্পমেয়াদী এবং দীর্ঘমেয়াদী আর্থিক পরিকল্পনা নিয়ে আলোচনা করুন

**সবসময় বাংলায় উত্তর দিন এবং ব্যবহারকারীর নির্দিষ্ট প্রশ্নের উপর ফোকাস করে কথোপকথনমূলক, সহায়ক এবং সহজবোধ্য রাখুন।**`
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
        { error: 'OpenAI থেকে কোন উত্তর নেই' },
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
          { error: 'হার সীমা অতিক্রম করেছে। অনুগ্রহ করে একটু অপেক্ষা করে আবার চেষ্টা করুন।' },
          { status: 429 }
        );
      }
      
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'অবৈধ API কী। অনুগ্রহ করে আপনার OpenAI API কী পরীক্ষা করুন।' },
          { status: 401 }
        );
      }
      
      if (error.status === 402) {
        return NextResponse.json(
          { error: 'পেমেন্ট প্রয়োজন। অনুগ্রহ করে আপনার OpenAI অ্যাকাউন্টের বিলিং পরীক্ষা করুন।' },
          { status: 402 }
        );
      }
      
              return NextResponse.json(
          { error: `OpenAI API ত্রুটি: ${error.message}` },
          { status: error.status || 500 }
        );
    }

    // Handle other errors
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'অভ্যন্তরীণ সার্ভার ত্রুটি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
