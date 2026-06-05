// ============================================================
// Matching Engine — Gender-specific compatibility scoring
// ============================================================

import { Customer, ScoreBreakdown, Match } from '@/types';
import { getCustomers } from '@/lib/store';

// ─── Scoring Weights (from SYSTEM_ARCHITECTURE.md) ───────────

const WEIGHTS = {
  age: 15,
  education: 15,
  income: 10,
  location: 10,
  religion: 10,
  lifestyle: 10,
  childrenPreference: 15,
  relocation: 10,
  height: 5,
};

// ─── Individual Dimension Scorers ────────────────────────────

function scoreAge(customer: Customer, candidate: Customer): number {
  const ageDiff = Math.abs(customer.age - candidate.age);

  if (customer.gender === 'Male') {
    // Male customers: prefer younger women (2-5 year gap ideal)
    const idealDiff = candidate.age < customer.age ? customer.age - candidate.age : 0;
    if (idealDiff >= 2 && idealDiff <= 5) return WEIGHTS.age;
    if (idealDiff >= 1 && idealDiff <= 7) return WEIGHTS.age * 0.8;
    if (idealDiff >= 0 && idealDiff <= 10) return WEIGHTS.age * 0.5;
    return WEIGHTS.age * 0.2;
  } else {
    // Female customers: flexible, use partner preference range
    const { ageMin, ageMax } = customer.partnerPreferences;
    if (candidate.age >= ageMin && candidate.age <= ageMax) return WEIGHTS.age;
    if (ageDiff <= 3) return WEIGHTS.age * 0.7;
    if (ageDiff <= 5) return WEIGHTS.age * 0.5;
    return WEIGHTS.age * 0.2;
  }
}

function scoreHeight(customer: Customer, candidate: Customer): number {
  if (customer.gender === 'Male') {
    // Male customers: matched with women who are shorter
    if (candidate.heightCm < customer.heightCm) return WEIGHTS.height;
    if (candidate.heightCm === customer.heightCm) return WEIGHTS.height * 0.8;
    return WEIGHTS.height * 0.3;
  } else {
    // Female customers: partner preferences
    const { heightMin, heightMax } = customer.partnerPreferences;
    if (candidate.heightCm >= heightMin && candidate.heightCm <= heightMax) return WEIGHTS.height;
    if (candidate.heightCm >= customer.heightCm) return WEIGHTS.height * 0.7;
    return WEIGHTS.height * 0.3;
  }
}

function scoreEducation(customer: Customer, candidate: Customer): number {
  const educationLevels: Record<string, number> = {
    "Bachelor's": 1, 'B.Tech': 1, 'B.Com': 1, 'BBA': 1, 'BCA': 1,
    "Master's": 2, 'M.Tech': 2, 'M.Sc': 2, 'M.A.': 2, 'M.Com': 2,
    'MBA': 3, 'Post Graduate Diploma': 2, 'CFA': 3,
    'CA': 3, 'CS': 3, 'LLM': 3,
    'MD': 4, 'MS (Medicine)': 4, 'Ph.D.': 4,
  };

  const customerLevel = educationLevels[customer.highestQualification] || 1;
  const candidateLevel = educationLevels[candidate.highestQualification] || 1;

  if (customer.gender === 'Male') {
    // Male: similar or lower education is fine
    if (candidateLevel <= customerLevel) return WEIGHTS.education;
    if (Math.abs(candidateLevel - customerLevel) <= 1) return WEIGHTS.education * 0.7;
    return WEIGHTS.education * 0.4;
  } else {
    // Female: holistic — similar or higher preferred
    if (candidateLevel >= customerLevel) return WEIGHTS.education;
    if (Math.abs(candidateLevel - customerLevel) <= 1) return WEIGHTS.education * 0.7;
    return WEIGHTS.education * 0.3;
  }
}

function scoreIncome(customer: Customer, candidate: Customer): number {
  if (customer.gender === 'Male') {
    // Male customers: should earn more than the match
    if (customer.annualIncome > candidate.annualIncome) return WEIGHTS.income;
    if (customer.annualIncome === candidate.annualIncome) return WEIGHTS.income * 0.8;
    return WEIGHTS.income * 0.3;
  } else {
    // Female: flexible, but prefer partner within range
    const { incomeMin, incomeMax } = customer.partnerPreferences;
    if (candidate.annualIncome >= incomeMin && candidate.annualIncome <= incomeMax) return WEIGHTS.income;
    if (candidate.annualIncome >= customer.annualIncome * 0.5) return WEIGHTS.income * 0.6;
    return WEIGHTS.income * 0.3;
  }
}

function scoreLocation(customer: Customer, candidate: Customer): number {
  // Same city = full score
  if (customer.city === candidate.city) return WEIGHTS.location;
  // Same state = good
  if (customer.state === candidate.state) return WEIGHTS.location * 0.7;
  // Preferred location match
  if (customer.partnerPreferences.preferredLocations.includes(candidate.city)) return WEIGHTS.location * 0.8;
  // Both open to relocate
  if (customer.openToRelocate === 'Yes' && candidate.openToRelocate === 'Yes') return WEIGHTS.location * 0.6;
  // One open to relocate
  if (customer.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') return WEIGHTS.location * 0.4;
  return WEIGHTS.location * 0.2;
}

function scoreReligion(customer: Customer, candidate: Customer): number {
  if (customer.religion === candidate.religion) {
    // Same religion
    if (customer.caste === candidate.caste) return WEIGHTS.religion;
    if (customer.partnerPreferences.preferredCaste === 'Any') return WEIGHTS.religion * 0.9;
    return WEIGHTS.religion * 0.7;
  }
  return WEIGHTS.religion * 0.1;
}

function scoreLifestyle(customer: Customer, candidate: Customer): number {
  let score = 0;
  const maxScore = WEIGHTS.lifestyle;

  // Dietary compatibility
  if (customer.dietaryPreference === candidate.dietaryPreference) score += maxScore * 0.35;
  else if (
    (customer.dietaryPreference === 'Vegetarian' && candidate.dietaryPreference === 'Eggetarian') ||
    (customer.dietaryPreference === 'Eggetarian' && candidate.dietaryPreference === 'Vegetarian')
  ) score += maxScore * 0.2;

  // Smoking
  if (customer.smokingPreference === candidate.smokingPreference) score += maxScore * 0.25;
  else if (customer.smokingPreference === 'Non-Smoker' && candidate.smokingPreference !== 'Non-Smoker') score += 0;
  else score += maxScore * 0.1;

  // Drinking
  if (customer.drinkingPreference === candidate.drinkingPreference) score += maxScore * 0.25;
  else if (
    (customer.drinkingPreference === 'Non-Drinker' && candidate.drinkingPreference === 'Occasional') ||
    (customer.drinkingPreference === 'Occasional' && candidate.drinkingPreference === 'Social')
  ) score += maxScore * 0.15;

  // Family values
  if (customer.familyValues === candidate.familyValues) score += maxScore * 0.15;

  return Math.round(score * 10) / 10;
}

function scoreChildren(customer: Customer, candidate: Customer): number {
  // Exact match on children preference
  if (customer.wantKids === candidate.wantKids) return WEIGHTS.childrenPreference;

  // Maybe is flexible
  if (customer.wantKids === 'Maybe' || candidate.wantKids === 'Maybe') {
    return WEIGHTS.childrenPreference * 0.7;
  }

  // Direct conflict (Yes vs No)
  return WEIGHTS.childrenPreference * 0.1;
}

function scoreRelocation(customer: Customer, candidate: Customer): number {
  // Same city = full score (relocation not needed)
  if (customer.city === candidate.city) return WEIGHTS.relocation;

  // Both open
  if (customer.openToRelocate === 'Yes' && candidate.openToRelocate === 'Yes') return WEIGHTS.relocation;

  // One open
  if (customer.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') return WEIGHTS.relocation * 0.6;

  // Maybe
  if (customer.openToRelocate === 'Maybe' || candidate.openToRelocate === 'Maybe') return WEIGHTS.relocation * 0.4;

  // Both No, different cities
  return WEIGHTS.relocation * 0.1;
}

// ─── Main Scoring Function ──────────────────────────────────

function calculateCompatibility(customer: Customer, candidate: Customer): ScoreBreakdown {
  const age = Math.round(scoreAge(customer, candidate) * 10) / 10;
  const education = Math.round(scoreEducation(customer, candidate) * 10) / 10;
  const income = Math.round(scoreIncome(customer, candidate) * 10) / 10;
  const location = Math.round(scoreLocation(customer, candidate) * 10) / 10;
  const religion = Math.round(scoreReligion(customer, candidate) * 10) / 10;
  const lifestyle = Math.round(scoreLifestyle(customer, candidate) * 10) / 10;
  const childrenPreference = Math.round(scoreChildren(customer, candidate) * 10) / 10;
  const relocation = Math.round(scoreRelocation(customer, candidate) * 10) / 10;
  const height = Math.round(scoreHeight(customer, candidate) * 10) / 10;

  const total = Math.round((age + education + income + location + religion + lifestyle + childrenPreference + relocation + height) * 10) / 10;

  return {
    age,
    education,
    income,
    location,
    religion,
    lifestyle,
    childrenPreference,
    relocation,
    height,
    total,
  };
}

// ─── Generate Matches ────────────────────────────────────────

export function generateMatches(customerId: string, topN = 10): Match[] {
  const allCustomers = getCustomers();
  const customer = allCustomers.find(c => c.id === customerId);

  if (!customer) return [];

  // Get opposite gender candidates
  const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';
  const candidates = allCustomers.filter(c => c.gender === oppositeGender && c.id !== customerId);

  // Score each candidate
  const scoredCandidates = candidates.map(candidate => {
    const scoreBreakdown = calculateCompatibility(customer, candidate);
    return {
      candidate,
      scoreBreakdown,
    };
  });

  // Sort by total score descending
  scoredCandidates.sort((a, b) => b.scoreBreakdown.total - a.scoreBreakdown.total);

  // Take top N
  const topMatches = scoredCandidates.slice(0, topN);

  // Create Match objects
  return topMatches.map((scored, idx) => ({
    id: `match_${customerId}_${scored.candidate.id}_${Date.now()}_${idx}`,
    customerId,
    matchedCustomerId: scored.candidate.id,
    compatibilityScore: scored.scoreBreakdown.total,
    scoreBreakdown: scored.scoreBreakdown,
    status: 'generated' as const,
    createdAt: new Date().toISOString(),
  }));
}

// ─── Get Score Label ─────────────────────────────────────────

export function getScoreLabel(score: number): { label: string; color: string; className: string } {
  if (score >= 75) return { label: 'Excellent Match', color: '#166534', className: 'score-high' };
  if (score >= 60) return { label: 'Good Match', color: '#92400E', className: 'score-medium' };
  if (score >= 45) return { label: 'Fair Match', color: '#92400E', className: 'score-medium' };
  return { label: 'Low Compatibility', color: '#991B1B', className: 'score-low' };
}
