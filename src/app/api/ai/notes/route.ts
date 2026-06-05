import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI API Key' }, { status: 400 });
    }

    const { notes, customer } = await req.json();

    if (!notes || notes.length === 0) {
      return NextResponse.json({ analysis: "No notes available to analyze." });
    }

    const notesText = notes.map((n: any) => `[${n.createdAt}] ${n.authorName}: ${n.content}`).join('\n');

    const prompt = `
You are an expert matchmaking AI assistant. Analyze the following matchmaker notes for a client named ${customer.firstName} ${customer.lastName} (${customer.age}y, ${customer.gender}, ${customer.city}).

Matchmaker Notes:
${notesText}

Synthesize these notes and extract any updated partner preferences, dealbreakers, or matchmaking instructions. Keep it concise, professional, and actionable (2-3 sentences max).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const analysis = response.choices[0].message.content || "Could not synthesize notes.";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('OpenAI Notes API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
