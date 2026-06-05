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
            content: `You are a senior matchmaker at a premium Indian matchmaking agency. Generate a personalized introduction email. Return JSON with:
- subject (email subject line)
- body (full email body, 3-4 paragraphs, warm and professional)
- tone (description of the tone used)`
          },
          {
            role: 'user',
            content: `Generate introduction email for ${customer.firstName} ${customer.lastName} (${customer.gender}, ${customer.age}y) about their potential match ${match.firstName} ${match.lastName} (${match.gender}, ${match.age}y, ${match.designation} at ${match.currentCompany}, ${match.city}, ${match.highestQualification}, ${match.religion}). Match enjoys ${match.hobbies?.slice(0, 3).join(', ')} and has ${match.familyValues} family values.`
          }
        ],
        max_tokens: 600,
        temperature: 0.8,
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
