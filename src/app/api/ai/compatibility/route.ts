import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { customer, match, score } = await req.json();
    
    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Return 503 to trigger client-side mock fallback
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
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
            content: `You are a senior matchmaker at a premium Indian matchmaking agency. Analyze the compatibility between two profiles and return a JSON object with:
- score (number 0-100)
- strengths (array of 3-5 specific compatibility strengths)
- concerns (array of 2-4 potential concerns)
- explanation (2-3 sentence overall assessment)`
          },
          {
            role: 'user',
            content: `Analyze compatibility (computed score: ${score}/100):

Customer: ${customer.firstName} ${customer.lastName}, ${customer.age}y, ${customer.gender}, ${customer.city}, ${customer.designation} at ${customer.currentCompany}, ${customer.religion} (${customer.caste}), ${customer.highestQualification}, Income: ${customer.annualIncome} LPA, Family: ${customer.familyValues} ${customer.familyType}, Want Kids: ${customer.wantKids}, Diet: ${customer.dietaryPreference}, Lifestyle: ${customer.lifestyle}

Match: ${match.firstName} ${match.lastName}, ${match.age}y, ${match.gender}, ${match.city}, ${match.designation} at ${match.currentCompany}, ${match.religion} (${match.caste}), ${match.highestQualification}, Income: ${match.annualIncome} LPA, Family: ${match.familyValues} ${match.familyType}, Want Kids: ${match.wantKids}, Diet: ${match.dietaryPreference}, Lifestyle: ${match.lifestyle}`
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
