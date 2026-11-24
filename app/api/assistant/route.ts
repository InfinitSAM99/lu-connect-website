import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "AI API key is missing. Please add AI_API_KEY to your .env.local" }, { status: 500 });
    }

    // NOTE: This is configured for Groq (very fast and free tier available). 
    // If you are using OpenAI, change the URL to https://api.openai.com/v1/chat/completions
    // and change the model to "gpt-3.5-turbo" or "gpt-4o-mini".
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", 
        messages: [
          { 
            role: "system", 
            content: "You are the LU Assistant for LU Connect, a campus social network for Kenyan university students. You are helpful, friendly, and concise. Help students with account issues, marketplace rules, boosting posts, and academic hub questions." 
          },
          ...messages
        ],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
