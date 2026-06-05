import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { customer } = await req.json();
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
            content: `You are a senior matchmaker. Create a profile summary for the matchmaker's reference. Return JSON with:
- headline (short professional headline)
- summary (2-3 sentence summary)
- keyTraits (array of 4-5 key personality/lifestyle traits)
- matchmakingAdvice (1-2 sentences of advice for matching this person)`
          },
          {
            role: 'user',
            content: `Summarize: ${customer.firstName} ${customer.lastName}, ${customer.age}y ${customer.gender}, ${customer.city}, ${customer.designation} at ${customer.currentCompany} (${customer.industry}), ${customer.highestQualification} from ${customer.undergraduateCollege}, ${customer.religion} (${customer.caste}), Income: ${customer.annualIncome} LPA, ${customer.familyValues} ${customer.familyType} family, Lifestyle: ${customer.lifestyle}, Hobbies: ${customer.hobbies?.join(', ')}, Kids: ${customer.wantKids}, Relocate: ${customer.openToRelocate}, Diet: ${customer.dietaryPreference}`
          }
        ],
        max_tokens: 400,
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
