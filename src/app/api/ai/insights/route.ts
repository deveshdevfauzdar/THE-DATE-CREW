import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { customer, match } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 503 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a senior matchmaker. Analyze two profiles and return JSON with:
- greenFlags (array of 4-5 positive indicators)
- redFlags (array of 2-3 potential concerns)
- potentialChallenges (array of 3-4 challenges they may face)
- conversationStarters (array of 4-5 ice-breaker suggestions)`
          },
          {
            role: 'user',
            content: `Analyze: ${customer.firstName} (${customer.gender}, ${customer.age}y, ${customer.city}, ${customer.designation}, ${customer.religion}, ${customer.familyValues}, Diet: ${customer.dietaryPreference}, Kids: ${customer.wantKids}) and ${match.firstName} (${match.gender}, ${match.age}y, ${match.city}, ${match.designation}, ${match.religion}, ${match.familyValues}, Diet: ${match.dietaryPreference}, Kids: ${match.wantKids}). Shared hobbies: ${customer.hobbies?.filter((h: string) => match.hobbies?.includes(h)).join(', ') || 'none found'}.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenAI API error' }, { status: 502 });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
