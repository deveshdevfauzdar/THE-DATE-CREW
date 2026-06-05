// ============================================================
// The Date Crew — Core Type Definitions
// ============================================================

// ─── Enums & Literal Types ────────────────────────────────────

export type Gender = 'Male' | 'Female';

export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Separated';

export type YesNoMaybe = 'Yes' | 'No' | 'Maybe';

export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';

export type SmokingPreference = 'Non-Smoker' | 'Occasional' | 'Regular';

export type DrinkingPreference = 'Non-Drinker' | 'Occasional' | 'Social' | 'Regular';

export type FamilyType = 'Joint' | 'Nuclear';

export type FamilyValues = 'Traditional' | 'Moderate' | 'Liberal';

export type ManglikStatus = 'Yes' | 'No' | 'Not Sure';

export type ProfileCreatedBy = 'Self' | 'Parent' | 'Sibling' | 'Friend';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export type PriorityTag = 'Standard' | 'Premium' | 'VIP';

export type JourneyStage =
  | 'Lead'
  | 'Consultation'
  | 'Verified'
  | 'Active Matching'
  | 'Introduction Sent'
  | 'Meeting Scheduled'
  | 'Relationship Progressing'
  | 'Success';

export type MatchStatus = 'generated' | 'reviewed' | 'sent' | 'accepted' | 'rejected' | 'expired';

export type ActivityType =
  | 'note_added'
  | 'match_sent'
  | 'match_generated'
  | 'profile_updated'
  | 'journey_updated'
  | 'introduction_sent'
  | 'call_logged';

// ─── Partner Preferences ──────────────────────────────────────

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  heightMin: number;
  heightMax: number;
  incomeMin: number;
  incomeMax: number;
  preferredEducation: string;
  preferredLocations: string[];
  preferredReligion: string;
  preferredCaste: string;
}

// ─── Journey Entry ────────────────────────────────────────────

export interface JourneyEntry {
  stage: JourneyStage;
  enteredAt: string;
  notes?: string;
}

// ─── Customer ─────────────────────────────────────────────────

export interface Customer {
  id: string;
  matchmakerId: string;

  // Personal
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  age: number;
  heightCm: number;
  weightKg: number;
  country: string;
  state: string;
  city: string;
  email: string;
  phone: string;
  profilePhotoUrl: string;
  aboutMe: string;
  motherTongue: string;
  profileCreatedBy: ProfileCreatedBy;
  verificationStatus: VerificationStatus;
  priorityTag: PriorityTag;

  // Education
  school: string;
  undergraduateCollege: string;
  degree: string;
  highestQualification: string;

  // Career
  currentCompany: string;
  designation: string;
  industry: string;
  annualIncome: number;

  // Family
  maritalStatus: MaritalStatus;
  numberOfSiblings: number;
  familyType: FamilyType;
  familyValues: FamilyValues;
  familyLocation: string;
  fatherOccupation: string;
  motherOccupation: string;

  // Preferences
  religion: string;
  caste: string;
  languages: string[];
  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;
  dietaryPreference: DietaryPreference;
  smokingPreference: SmokingPreference;
  drinkingPreference: DrinkingPreference;
  manglikStatus: ManglikStatus;

  // Personality
  hobbies: string[];
  interests: string[];
  lifestyle: string;
  relationshipGoals: string;

  // Partner Preferences
  partnerPreferences: PartnerPreferences;

  // Journey
  journeyStatus: JourneyStage;
  journeyHistory: JourneyEntry[];

  // Metadata
  lastContacted: string;
  engagementScore: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Note ─────────────────────────────────────────────────────

export interface Note {
  id: string;
  customerId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Match ────────────────────────────────────────────────────

export interface ScoreBreakdown {
  age: number;
  education: number;
  income: number;
  location: number;
  religion: number;
  lifestyle: number;
  childrenPreference: number;
  relocation: number;
  height: number;
  total: number;
}

export interface Match {
  id: string;
  customerId: string;
  matchedCustomerId: string;
  compatibilityScore: number;
  scoreBreakdown: ScoreBreakdown;
  aiExplanation?: string;
  aiInsights?: MatchInsights;
  status: MatchStatus;
  createdAt: string;
  sentAt?: string;
}

// ─── AI Types ─────────────────────────────────────────────────

export interface CompatibilityAnalysis {
  score: number;
  strengths: string[];
  concerns: string[];
  explanation: string;
}

export interface MatchInsights {
  greenFlags: string[];
  redFlags: string[];
  potentialChallenges: string[];
  conversationStarters: string[];
}

export interface GeneratedIntroduction {
  subject: string;
  body: string;
  tone: string;
}

export interface ProfileSummary {
  headline: string;
  summary: string;
  keyTraits: string[];
  matchmakingAdvice: string;
}

// ─── Matchmaker ───────────────────────────────────────────────

export interface Matchmaker {
  id: string;
  email: string;
  password: string;
  name: string;
  avatarUrl: string;
  role: 'matchmaker' | 'admin';
  createdAt: string;
}

// ─── Activity ─────────────────────────────────────────────────

export interface Activity {
  id: string;
  matchmakerId: string;
  customerId: string;
  customerName: string;
  actionType: ActivityType;
  description: string;
  createdAt: string;
}

// ─── Introduction ─────────────────────────────────────────────

export interface Introduction {
  id: string;
  matchId: string;
  message: string;
  status: 'draft' | 'sent' | 'opened' | 'responded';
  sentAt?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────

export interface DashboardStats {
  totalCustomers: number;
  activeMatches: number;
  introductionsSent: number;
  successStories: number;
  pendingReviews: number;
}

// ─── Filter State ─────────────────────────────────────────────

export interface FilterState {
  search: string;
  gender: Gender | 'All';
  ageMin: number | null;
  ageMax: number | null;
  city: string | 'All';
  religion: string | 'All';
  caste: string | 'All';
  education: string | 'All';
  incomeMin: number | null;
  incomeMax: number | null;
  maritalStatus: MaritalStatus | 'All';
  childrenPreference: YesNoMaybe | 'All';
  relocationPreference: YesNoMaybe | 'All';
  journeyStatus: JourneyStage | 'All';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
