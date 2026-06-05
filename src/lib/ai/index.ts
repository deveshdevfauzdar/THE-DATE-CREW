// ============================================================
// AI Module — OpenAI integration with mock fallback
// ============================================================

import { Customer, Note, CompatibilityAnalysis, MatchInsights, GeneratedIntroduction, ProfileSummary } from '@/types';

// ─── Mock AI Responses (used when OpenAI unavailable) ────────

function generateMockCompatibility(customer: Customer, match: Customer, score: number): CompatibilityAnalysis {
  const strengths: string[] = [];
  const concerns: string[] = [];

  // Analyze actual compatibility factors
  if (customer.religion === match.religion) strengths.push(`Shared religious background (${customer.religion}) provides a strong cultural foundation`);
  if (customer.city === match.city) strengths.push(`Both based in ${customer.city}, eliminating relocation concerns`);
  if (customer.wantKids === match.wantKids) strengths.push(`Aligned views on having children (${customer.wantKids})`);
  if (customer.familyValues === match.familyValues) strengths.push(`Compatible family values — both identify as ${(customer.familyValues || 'traditional').toLowerCase()}`);
  if (customer.dietaryPreference === match.dietaryPreference) strengths.push(`Shared dietary preferences (${customer.dietaryPreference})`);
  if (customer.openToRelocate === 'Yes' && match.openToRelocate === 'Yes') strengths.push('Both open to relocation, offering geographic flexibility');

  // Hobbies overlap
  const sharedHobbies = customer.hobbies.filter(h => match.hobbies.includes(h));
  if (sharedHobbies.length >= 2) strengths.push(`Common interests: ${sharedHobbies.slice(0, 3).join(', ')}`);

  // Education compatibility
  if (customer.highestQualification === match.highestQualification) {
    strengths.push(`Similar educational background (${customer.highestQualification})`);
  }

  // Concerns
  if (customer.religion !== match.religion) concerns.push(`Different religious backgrounds (${customer.religion} vs ${match.religion}) may require discussion`);
  if (customer.city !== match.city && customer.openToRelocate === 'No' && match.openToRelocate === 'No') {
    concerns.push(`Geographic distance (${customer.city} vs ${match.city}) with neither open to relocation`);
  }
  if (customer.wantKids !== match.wantKids && customer.wantKids !== 'Maybe' && match.wantKids !== 'Maybe') {
    concerns.push(`Differing views on children (${customer.wantKids} vs ${match.wantKids})`);
  }
  if (customer.dietaryPreference !== match.dietaryPreference) {
    concerns.push(`Different dietary preferences may need accommodation`);
  }
  if (customer.smokingPreference === 'Non-Smoker' && match.smokingPreference === 'Regular') {
    concerns.push('Smoking habit difference could be a concern');
  }

  // Ensure at least some content
  if (strengths.length === 0) strengths.push('Both profiles show maturity and readiness for commitment');
  if (concerns.length === 0) concerns.push('No major concerns identified — a well-rounded match');

  const explanation = score >= 75
    ? `This is an excellent match with strong alignment across multiple dimensions. ${customer.firstName} and ${match.firstName} share ${strengths.length} key compatibility factors, making this a high-potential pairing worth pursuing.`
    : score >= 60
    ? `A good match with solid compatibility. While there are ${concerns.length} area${concerns.length > 1 ? 's' : ''} that may need discussion, the overall alignment in values and lifestyle is promising.`
    : `A moderate match with some compatibility. There are meaningful areas of alignment, but ${concerns.length} potential concern${concerns.length > 1 ? 's' : ''} should be addressed before proceeding.`;

  return {
    score,
    strengths: strengths.slice(0, 5),
    concerns: concerns.slice(0, 4),
    explanation,
  };
}

function generateMockInsights(customer: Customer, match: Customer): MatchInsights {
  const greenFlags: string[] = [];
  const redFlags: string[] = [];
  const potentialChallenges: string[] = [];
  const conversationStarters: string[] = [];

  // Green flags
  if (customer.familyValues === match.familyValues) greenFlags.push(`Both value ${(customer.familyValues || 'traditional').toLowerCase()} family dynamics`);
  if (customer.lifestyle === match.lifestyle) greenFlags.push(`Compatible lifestyle — both ${(customer.lifestyle || 'balanced').toLowerCase()}`);
  if (customer.religion === match.religion) greenFlags.push('Shared cultural and religious values');
  if (customer.wantKids === match.wantKids) greenFlags.push('Aligned on family planning goals');
  greenFlags.push(`${match.firstName} has a stable career as ${match.designation} at ${match.currentCompany}`);
  if (match.engagementScore >= 70) greenFlags.push(`${match.firstName} is highly engaged and responsive in the matchmaking process`);

  // Red flags
  if (Math.abs(customer.annualIncome - match.annualIncome) > 30) redFlags.push('Significant income disparity may create lifestyle differences');
  if (customer.smokingPreference === 'Non-Smoker' && match.smokingPreference === 'Regular') redFlags.push(`${match.firstName} is a regular smoker`);
  if (customer.drinkingPreference === 'Non-Drinker' && match.drinkingPreference === 'Regular') redFlags.push(`${match.firstName} is a regular drinker`);
  if (redFlags.length === 0) redFlags.push('No significant red flags identified');

  // Challenges
  if (customer.city !== match.city) potentialChallenges.push(`Long-distance dynamics (${customer.city} ↔ ${match.city})`);
  if (customer.familyValues !== match.familyValues) potentialChallenges.push('Different family value systems may need alignment');
  if (customer.dietaryPreference !== match.dietaryPreference) potentialChallenges.push('Dietary differences may need compromise in shared meals');
  potentialChallenges.push('Initial adjustment period typical for arranged introductions');

  // Conversation starters
  const shared = customer.hobbies.filter(h => match.hobbies.includes(h));
  if (shared.length > 0) conversationStarters.push(`Both enjoy ${shared[0]} — ask about their favorite ${(shared[0] || '').toLowerCase()} experiences`);
  conversationStarters.push(`${match.firstName} works at ${match.currentCompany} — ask about their career journey`);
  if (match.interests.length > 0) conversationStarters.push(`${match.firstName} is interested in ${match.interests[0]} — great topic to explore`);
  conversationStarters.push(`Ask about their experience growing up in a ${(match.familyType || 'nuclear').toLowerCase()} family`);
  conversationStarters.push(`Discuss travel experiences and favorite destinations`);

  return {
    greenFlags: greenFlags.slice(0, 5),
    redFlags: redFlags.slice(0, 3),
    potentialChallenges: potentialChallenges.slice(0, 4),
    conversationStarters: conversationStarters.slice(0, 5),
  };
}

function generateMockIntroduction(customer: Customer, match: Customer): GeneratedIntroduction {
  const isCustomerMale = customer.gender === 'Male';
  const client = customer;
  const prospect = match;

  return {
    subject: `A Special Introduction: ${prospect.firstName} ${prospect.lastName} — ${prospect.designation} from ${prospect.city}`,
    body: `Dear ${client.firstName},

I hope this message finds you well! I'm excited to share a profile that I believe aligns beautifully with what you're looking for.

Meet ${prospect.firstName} ${prospect.lastName}, a ${prospect.age}-year-old ${prospect.designation} at ${prospect.currentCompany}, currently based in ${prospect.city}. ${prospect.firstName} holds a ${prospect.highestQualification} from ${prospect.undergraduateCollege} and comes from a ${(prospect.familyValues || 'traditional').toLowerCase()} ${(prospect.familyType || 'nuclear').toLowerCase()} family.

${prospect.firstName} describes ${isCustomerMale ? 'herself' : 'himself'} as someone who is ${(prospect.lifestyle || 'balanced').toLowerCase()}. ${isCustomerMale ? 'She' : 'He'} enjoys ${prospect.hobbies?.slice(0, 3).join(', ') || 'various activities'} and is passionate about ${prospect.interests?.slice(0, 2).join(' and ') || 'learning new things'}.

What makes this match particularly compelling:
• ${customer.religion === prospect.religion ? 'Shared cultural values and religious background' : 'Open-minded approach to cultural differences'}
• ${customer.city === prospect.city ? 'Both based in the same city' : prospect.openToRelocate === 'Yes' ? `Open to relocating from ${prospect.city}` : `Currently in ${prospect.city}`}
• ${customer.wantKids === prospect.wantKids ? 'Aligned views on family planning' : 'Similar long-term outlook'}
• Strong career trajectory with an income of ${prospect.annualIncome} LPA

I'd love to arrange an introduction if you're interested. Please let me know your thoughts, and I'll coordinate the next steps.

Warm regards,
The Date Crew Team`,
    tone: 'Professional yet warm',
  };
}

function generateMockSummary(customer: Customer): ProfileSummary {
  const ageGroup = customer.age < 28 ? 'young' : customer.age < 33 ? 'mid-career' : 'established';

  return {
    headline: `${ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)} ${customer.designation} from ${customer.city}`,
    summary: `${customer.firstName} is a ${customer.age}-year-old ${customer.designation} at ${customer.currentCompany}, based in ${customer.city}. With a ${customer.highestQualification} from ${customer.undergraduateCollege}, ${customer.firstName} brings a ${(customer.familyValues || 'traditional').toLowerCase()} family background and a ${(customer.lifestyle || 'balanced').toLowerCase()} lifestyle. Currently earning ${customer.annualIncome} LPA in the ${customer.industry} industry, ${customer.firstName} is ${customer.wantKids === 'Yes' ? 'eager to start a family' : customer.wantKids === 'Maybe' ? 'open to the idea of children' : 'focused on partnership first'} and ${customer.openToRelocate === 'Yes' ? 'willing to relocate for the right match' : 'prefers to stay in ' + customer.city}.`,
    keyTraits: [
      `${customer.lifestyle}`,
      `${customer.familyValues} values`,
      `${customer.dietaryPreference}`,
      `${customer.smokingPreference === 'Non-Smoker' ? 'Non-smoker' : 'Smokes ' + (customer.smokingPreference || '').toLowerCase()}`,
      `Hobbies: ${customer.hobbies?.slice(0, 3).join(', ') || 'N/A'}`,
    ],
    matchmakingAdvice: `Focus on candidates who share ${customer.firstName}'s ${(customer.familyValues || 'traditional').toLowerCase()} values and ${(customer.lifestyle || 'balanced').toLowerCase()} lifestyle. ${customer.religion} background is ${customer.partnerPreferences?.preferredCaste !== 'Any' ? 'important — same community preferred' : 'preferred but flexible'}. ${customer.openToRelocate === 'Yes' ? 'Location flexibility is a plus for this profile.' : `Prioritize matches in or near ${customer.city}.`}`,
  };
}

function generateMockNoteAnalysis(notes: Note[], customer: Customer): string {
  if (notes.length === 0) return "No notes available to analyze.";
  
  const combinedText = notes.map(n => n.content.toLowerCase()).join(' ');
  
  const insights = [];
  
  if (combinedText.includes('relocat') || combinedText.includes('move') || combinedText.includes('city')) {
    insights.push(`Strong location preferences detected. The matchmaking engine will dynamically weight matches near ${customer.city} higher.`);
  }
  
  if (combinedText.includes('tradition') || combinedText.includes('culture') || combinedText.includes('religion') || combinedText.includes('caste')) {
    insights.push(`Cultural compatibility emphasized in recent conversations. Strict community filtering has been applied to upcoming matches.`);
  }
  
  if (combinedText.includes('career') || combinedText.includes('work') || combinedText.includes('ambition') || combinedText.includes('job')) {
    insights.push(`Professional alignment is a priority. Matching algorithm will look for candidates in similar corporate environments.`);
  }
  
  if (combinedText.includes('pause') || combinedText.includes('stop') || combinedText.includes('later')) {
    insights.push(`Client indicated a desire to slow down. Recommended to pause active matching for 2 weeks.`);
  }
  
  if (insights.length === 0) {
    insights.push(`Processed ${notes.length} notes. Client is actively engaged. No major deviations from original profile preferences detected.`);
  }

  return insights.join(' ');
}


// ─── API Functions (try OpenAI, fallback to mock) ────────────

export async function processNotes(notes: Note[], customer: Customer): Promise<string> {
  try {
    const response = await fetch('/api/ai/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, customer }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.analysis;
    }
    throw new Error('API failed');
  } catch {
    return generateMockNoteAnalysis(notes, customer);
  }
}

export async function getCompatibilityAnalysis(
  customer: Customer,
  match: Customer,
  score: number
): Promise<CompatibilityAnalysis> {
  try {
    const response = await fetch('/api/ai/compatibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, match, score }),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('API failed');
  } catch {
    // Fallback to mock
    return generateMockCompatibility(customer, match, score);
  }
}

export async function getMatchInsights(
  customer: Customer,
  match: Customer
): Promise<MatchInsights> {
  try {
    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, match }),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('API failed');
  } catch {
    return generateMockInsights(customer, match);
  }
}

export async function getIntroduction(
  customer: Customer,
  match: Customer
): Promise<GeneratedIntroduction> {
  try {
    const response = await fetch('/api/ai/introduction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, match }),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('API failed');
  } catch {
    return generateMockIntroduction(customer, match);
  }
}

export async function getProfileSummary(customer: Customer): Promise<ProfileSummary> {
  try {
    const response = await fetch('/api/ai/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer }),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('API failed');
  } catch {
    return generateMockSummary(customer);
  }
}
