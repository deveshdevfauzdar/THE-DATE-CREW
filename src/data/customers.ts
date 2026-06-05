// ============================================================
// The Date Crew — Dummy Data Generator
// 120+ realistic Indian profiles for matchmaking pool
// ============================================================

import { Customer, Matchmaker, Note, Activity } from '@/types';
import type { JourneyStage, ActivityType } from '@/types';

// ─── Data Pools ───────────────────────────────────────────────

const MALE_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Sai', 'Arnav',
  'Dhruv', 'Kabir', 'Ishaan', 'Kartik', 'Rohan', 'Rishabh', 'Ayaan', 'Karan',
  'Vikram', 'Aryan', 'Yash', 'Harsh', 'Pranav', 'Nikhil', 'Rahul', 'Anand',
  'Siddharth', 'Kunal', 'Rajesh', 'Amit', 'Vishal', 'Manish', 'Akash', 'Gaurav',
  'Sahil', 'Deepak', 'Ravi', 'Suresh', 'Mohit', 'Tushar', 'Varun', 'Aniket',
  'Dev', 'Lakshay', 'Parth', 'Naveen', 'Abhinav', 'Chirag', 'Neeraj',
  'Pradeep', 'Shantanu', 'Tarun', 'Uday', 'Vineet', 'Yuvraj', 'Zain', 'Farhan',
  'Imran', 'Omar', 'Samir', 'Tanmay', 'Rohit',
];

const FEMALE_FIRST_NAMES = [
  'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya', 'Aadhya', 'Isha', 'Kiara',
  'Anika', 'Avni', 'Priya', 'Sneha', 'Ritika', 'Pooja', 'Simran', 'Tanya',
  'Neha', 'Kavya', 'Radhika', 'Shruti', 'Meera', 'Nisha', 'Aditi', 'Riya',
  'Ankita', 'Divya', 'Kriti', 'Pallavi', 'Sakshi', 'Swati', 'Trisha', 'Vani',
  'Ishita', 'Jhanvi', 'Manya', 'Nandini', 'Pihu', 'Rhea', 'Sanya', 'Tanvi',
  'Uma', 'Vidya', 'Aishwarya', 'Bhavna', 'Chandni', 'Deepika', 'Esha', 'Fatima',
  'Gauri', 'Harsha', 'Inaya', 'Jasmine', 'Komal', 'Lavanya', 'Manasi', 'Nivedita',
  'Oorja', 'Payal', 'Rashi', 'Saumya',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Verma', 'Joshi',
  'Reddy', 'Nair', 'Rao', 'Iyer', 'Kapoor', 'Mehta', 'Shah', 'Malhotra',
  'Chopra', 'Desai', 'Bhat', 'Pillai', 'Menon', 'Chauhan', 'Mishra', 'Pandey',
  'Tiwari', 'Saxena', 'Sinha', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Das',
  'Ghosh', 'Bose', 'Sen', 'Roy', 'Dutta', 'Kulkarni', 'Jain', 'Trivedi',
  'Bhatt', 'Thakur', 'Yadav', 'Rajput', 'Ahuja', 'Batra', 'Khanna', 'Sethi',
  'Bajaj', 'Arora', 'Kaur',
];

const CITIES_BY_STATE: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Delhi': ['New Delhi', 'Gurgaon', 'Noida'],
  'Karnataka': ['Bangalore', 'Mysore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore'],
  'Telangana': ['Hyderabad'],
  'West Bengal': ['Kolkata'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
  'Kerala': ['Kochi', 'Trivandrum'],
  'Madhya Pradesh': ['Indore', 'Bhopal'],
};

const RELIGIONS_WITH_CASTES: Record<string, string[]> = {
  'Hindu': ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Maratha', 'Rajput', 'Agarwal', 'Jat', 'Nair', 'Reddy', 'Iyer', 'Iyengar', 'Lingayat', 'Patel'],
  'Muslim': ['Sunni', 'Shia', 'Bohra'],
  'Sikh': ['Jat Sikh', 'Khatri', 'Arora'],
  'Christian': ['Catholic', 'Protestant', 'Syrian Christian'],
  'Jain': ['Digambar', 'Shwetambar'],
};

const MOTHER_TONGUES = [
  'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali',
  'Gujarati', 'Punjabi', 'Malayalam', 'Odia', 'Urdu',
];

const SCHOOLS = [
  'Delhi Public School', "St. Xavier's High School", 'The Doon School',
  'Bishop Cotton School', 'La Martiniere', 'Mayo College',
  'Modern School', 'Kendriya Vidyalaya', 'DAV Public School',
  'Ryan International', 'Springdales School', 'Army Public School',
];

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'BITS Pilani', 'NIT Trichy', 'Delhi University', 'Mumbai University',
  'Christ University', 'Manipal University', 'VIT Vellore',
  "St. Xavier's College", 'Loyola College', 'SRCC Delhi',
  'Lady Shri Ram College', "St. Stephen's College", 'Presidency College',
  'IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'ISB Hyderabad',
  'NLSIU Bangalore', 'NLU Delhi', 'AIIMS Delhi', 'MAMC Delhi',
  'FMS Delhi', 'XLRI Jamshedpur', 'MICA Ahmedabad',
  'Symbiosis Pune', 'Ashoka University', 'Shiv Nadar University',
];

const DEGREES = [
  'B.Tech', 'B.E.', 'B.Com', 'B.A.', 'B.Sc', 'BBA', 'BCA',
  'MBBS', 'BDS', 'B.Arch', 'LLB', 'B.Pharm',
];

const HIGHEST_QUALIFICATIONS = [
  "Bachelor's", "Master's", 'MBA', 'M.Tech', 'M.Sc', 'M.A.',
  'Ph.D.', 'CA', 'CS', 'MD', 'MS (Medicine)', 'LLM', 'M.Com',
  'Post Graduate Diploma', 'CFA',
];

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Infosys', 'TCS',
  'Wipro', 'HCL Technologies', 'Reliance Industries', 'Tata Motors',
  'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'PhonePe', 'Razorpay',
  'HDFC Bank', 'ICICI Bank', 'Kotak Mahindra', 'Goldman Sachs',
  'JP Morgan', 'McKinsey', 'BCG', 'Bain & Company', 'Deloitte',
  'EY', 'PwC', 'KPMG', 'Accenture', 'Adobe', 'Salesforce',
  'Myntra', 'Unacademy', 'OYO Rooms', 'Ola',
  'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare',
  'Mahindra Group', 'Adani Group', 'ITC Limited', 'Hindustan Unilever',
  'Bajaj Auto', 'Larsen & Toubro', 'State Bank of India',
];

const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Product Manager',
  'Data Scientist', 'Business Analyst', 'Consultant', 'Associate',
  'Vice President', 'Manager', 'Senior Manager', 'Director',
  'Doctor', 'Surgeon', 'Advocate', 'Senior Advocate',
  'Chartered Accountant', 'Company Secretary', 'Architect',
  'Investment Banker', 'Financial Analyst', 'Marketing Manager',
  'UX Designer', 'Lead Designer', 'Engineering Manager',
  'Entrepreneur', 'Founder', 'Co-Founder',
  'IAS Officer', 'Civil Servant',
  'Research Scientist', 'Professor', 'Assistant Professor',
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Consulting', 'Education',
  'E-Commerce', 'Banking', 'Manufacturing', 'Media', 'Real Estate',
  'Government', 'Defense', 'Legal', 'Pharmaceuticals', 'Automotive',
  'FMCG', 'Hospitality', 'Telecom', 'Energy', 'Research',
];

const HOBBIES = [
  'Reading', 'Traveling', 'Photography', 'Cooking', 'Yoga',
  'Gym & Fitness', 'Painting', 'Music', 'Dancing', 'Hiking',
  'Swimming', 'Cricket', 'Badminton', 'Running', 'Cycling',
  'Gardening', 'Chess', 'Writing', 'Meditation', 'Movies',
];

const INTERESTS = [
  'Technology', 'Science', 'Art & Culture', 'Politics', 'History',
  'Philosophy', 'Psychology', 'Finance', 'Startups', 'Social Work',
  'Environment', 'Fashion', 'Food & Cuisine', 'Sports', 'Music',
  'Literature', 'Cinema', 'Theater', 'Architecture', 'Space',
];

const LIFESTYLES = [
  'Active & Outdoorsy', 'Balanced & Moderate', 'Homebody & Cozy',
  'Social & Outgoing', 'Health-Conscious', 'Adventurous',
  'Spiritual & Mindful', 'Urban & Fast-Paced', 'Calm & Peaceful',
];

const RELATIONSHIP_GOALS = [
  'Looking for a life partner who shares similar values and goals',
  'Seeking a meaningful connection built on mutual respect and understanding',
  'Want to build a family with someone who values both tradition and modernity',
  'Looking for a supportive partner who encourages personal growth',
  'Seeking companionship with someone intellectually stimulating',
  'Want a partner who values family while being career-oriented',
  'Looking for a balanced relationship with open communication',
  'Seeking a partner for a loving, committed relationship',
];

const ABOUT_ME_TEMPLATES = [
  (name: string, profession: string, city: string) =>
    `I'm ${name}, a ${profession} based in ${city}. I believe in working hard and cherishing meaningful relationships. In my free time, I enjoy exploring new places and trying different cuisines. Family means everything to me.`,
  (name: string, profession: string, city: string) =>
    `Hi, I'm ${name}! Currently working as a ${profession} in ${city}. I'm a curious soul who loves learning new things and having deep conversations. I value honesty, kindness, and a good sense of humor.`,
  (name: string, profession: string, city: string) =>
    `${name} here — a ${profession} who calls ${city} home. I'm passionate about my career but equally value personal relationships. I enjoy weekend getaways, good books, and meaningful conversations over chai.`,
  (name: string, profession: string, city: string) =>
    `I'm ${name}, currently a ${profession} in ${city}. I believe life is about balance — I work with dedication and play with enthusiasm. I enjoy fitness, travel, and spending time with family.`,
  (name: string, profession: string, city: string) =>
    `Hello! I'm ${name}, a ${profession} living in ${city}. I'm the kind of person who values depth over superficiality. I love intellectual discussions, cultural experiences, and quiet evenings at home.`,
];

const FATHER_OCCUPATIONS = [
  'Retired Government Officer', 'Businessman', 'Doctor', 'Engineer',
  'Teacher', 'Bank Manager', 'Army Officer', 'Advocate', 'Farmer',
  'Professor', 'Chartered Accountant', 'Retired Army Colonel',
  'Civil Servant', 'Industrialist', 'Architect',
];

const MOTHER_OCCUPATIONS = [
  'Homemaker', 'Teacher', 'Doctor', 'Professor', 'Bank Officer',
  'Businesswoman', 'Government Officer', 'Retired Teacher', 'Nurse',
  'Architect', 'Lawyer', 'Homemaker & Social Worker',
];

// ─── Utility Functions ────────────────────────────────────────

// Simple seeded random for consistent data
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => seededRandom() - 0.5);
  return shuffled.slice(0, n);
}

function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randomDate(startYear: number, endYear: number): string {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date('2026-06-01');
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function randomPhone(): string {
  return `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`;
}

function randomEmail(first: string, last: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  return `${first.toLowerCase()}.${last.toLowerCase()}${randomInt(1, 99)}@${pick(domains)}`;
}

function randomRecentDate(daysBack: number): string {
  const d = new Date('2026-06-01');
  d.setDate(d.getDate() - randomInt(0, daysBack));
  d.setHours(randomInt(8, 20), randomInt(0, 59), 0, 0);
  return d.toISOString();
}

function getAvatarUrl(name: string, gender: string): string {
  const style = gender === 'Male' ? 'avataaars' : 'avataaars';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}&backgroundColor=f4e9e1`;
}

// ─── Profile Generator ───────────────────────────────────────

function generateCustomer(index: number, gender: 'Male' | 'Female', matchmakerId: string): Customer {
  const firstName = gender === 'Male'
    ? MALE_FIRST_NAMES[index % MALE_FIRST_NAMES.length]
    : FEMALE_FIRST_NAMES[index % FEMALE_FIRST_NAMES.length];
  const lastName = pick(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;

  const stateKeys = Object.keys(CITIES_BY_STATE);
  const state = pick(stateKeys);
  const city = pick(CITIES_BY_STATE[state]);

  const dob = randomDate(1988, 2003);
  const age = calculateAge(dob);

  const heightCm = gender === 'Male' ? randomInt(165, 190) : randomInt(150, 175);
  const weightKg = gender === 'Male' ? randomInt(60, 95) : randomInt(45, 75);

  const religion = pick(Object.keys(RELIGIONS_WITH_CASTES));
  const caste = pick(RELIGIONS_WITH_CASTES[religion]);

  const company = pick(COMPANIES);
  const designation = pick(DESIGNATIONS);
  const industry = pick(INDUSTRIES);
  const incomeBase = randomInt(5, 80);
  const annualIncome = incomeBase <= 50 ? incomeBase : randomInt(15, 50);

  const degree = pick(DEGREES);
  const college = pick(COLLEGES);
  const qualification = pick(HIGHEST_QUALIFICATIONS);

  const maritalStatus = seededRandom() > 0.85 ? pick(['Divorced', 'Widowed'] as const) : 'Never Married' as const;

  const motherTongue = pick(MOTHER_TONGUES);
  const langs = ['English', motherTongue];
  if (seededRandom() > 0.5) langs.push('Hindi');
  const languages = [...new Set(langs)];

  const wantKids = pick(['Yes', 'No', 'Maybe'] as const);
  const openToRelocate = pick(['Yes', 'No', 'Maybe'] as const);
  const openToPets = pick(['Yes', 'No', 'Maybe'] as const);
  const dietaryPreference = pick(['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'] as const);
  const smokingPreference = pick(['Non-Smoker', 'Occasional', 'Regular'] as const);
  const drinkingPreference = pick(['Non-Drinker', 'Occasional', 'Social', 'Regular'] as const);
  const manglikStatus = religion === 'Hindu' ? pick(['Yes', 'No', 'Not Sure'] as const) : 'Not Sure' as const;

  const hobbies = pickN(HOBBIES, randomInt(3, 6));
  const interests = pickN(INTERESTS, randomInt(2, 5));
  const lifestyle = pick(LIFESTYLES);
  const relationshipGoals = pick(RELATIONSHIP_GOALS);

  const aboutMeTemplate = pick(ABOUT_ME_TEMPLATES);
  const aboutMe = aboutMeTemplate(firstName, designation, city);

  const partnerPreferences = {
    ageMin: gender === 'Male' ? Math.max(21, age - 5) : age - 2,
    ageMax: gender === 'Male' ? age - 1 : age + 7,
    heightMin: gender === 'Male' ? 150 : heightCm,
    heightMax: gender === 'Male' ? heightCm - 5 : 195,
    incomeMin: gender === 'Male' ? 0 : Math.max(5, annualIncome - 10),
    incomeMax: gender === 'Male' ? annualIncome : 100,
    preferredEducation: qualification,
    preferredLocations: [city, pick(CITIES_BY_STATE[state] || [city])],
    preferredReligion: religion,
    preferredCaste: seededRandom() > 0.3 ? caste : 'Any',
  };

  const journeyStages: JourneyStage[] = [
    'Lead', 'Consultation', 'Verified', 'Active Matching',
    'Introduction Sent', 'Meeting Scheduled', 'Relationship Progressing', 'Success',
  ];
  const currentStageIndex = randomInt(0, 7);
  const journeyStatus = journeyStages[currentStageIndex];
  const journeyHistory = journeyStages.slice(0, currentStageIndex + 1).map((stage, i) => ({
    stage,
    enteredAt: randomRecentDate(180 - i * 20),
    notes: i === 0 ? 'Initial registration' : undefined,
  }));

  return {
    id: `cust_${gender.toLowerCase()}_${String(index + 1).padStart(3, '0')}`,
    matchmakerId,
    firstName,
    lastName,
    gender,
    dateOfBirth: dob,
    age,
    heightCm,
    weightKg,
    country: 'India',
    state,
    city,
    email: randomEmail(firstName, lastName),
    phone: randomPhone(),
    profilePhotoUrl: getAvatarUrl(fullName, gender),
    aboutMe,
    motherTongue,
    profileCreatedBy: pick(['Self', 'Parent', 'Sibling', 'Friend'] as const),
    verificationStatus: seededRandom() > 0.15 ? 'Verified' : pick(['Pending', 'Rejected'] as const),
    priorityTag: seededRandom() > 0.7 ? pick(['Premium', 'VIP'] as const) : 'Standard',
    school: pick(SCHOOLS),
    undergraduateCollege: college,
    degree,
    highestQualification: qualification,
    currentCompany: company,
    designation,
    industry,
    annualIncome,
    maritalStatus,
    numberOfSiblings: randomInt(0, 4),
    familyType: pick(['Joint', 'Nuclear'] as const),
    familyValues: pick(['Traditional', 'Moderate', 'Liberal'] as const),
    familyLocation: city,
    fatherOccupation: pick(FATHER_OCCUPATIONS),
    motherOccupation: pick(MOTHER_OCCUPATIONS),
    religion,
    caste,
    languages,
    wantKids,
    openToRelocate,
    openToPets,
    dietaryPreference,
    smokingPreference,
    drinkingPreference,
    manglikStatus,
    hobbies,
    interests,
    lifestyle,
    relationshipGoals,
    partnerPreferences,
    journeyStatus,
    journeyHistory,
    lastContacted: randomRecentDate(30),
    engagementScore: randomInt(30, 100),
    createdAt: randomRecentDate(365),
    updatedAt: randomRecentDate(30),
  };
}

// ─── Matchmakers ──────────────────────────────────────────────

export const matchmakers: Matchmaker[] = [
  {
    id: 'mm_001',
    email: 'priya@thedatecrew.com',
    password: 'matchmaker123',
    name: 'Priya Kapoor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaKapoor&backgroundColor=f4e9e1',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mm_002',
    email: 'rahul@thedatecrew.com',
    password: 'matchmaker123',
    name: 'Rahul Mehta',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulMehta&backgroundColor=f4e9e1',
    role: 'matchmaker',
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'mm_003',
    email: 'anita@thedatecrew.com',
    password: 'matchmaker123',
    name: 'Anita Sharma',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnitaSharma&backgroundColor=f4e9e1',
    role: 'matchmaker',
    createdAt: '2024-06-01T00:00:00Z',
  },
];

// ─── Generate 120 Customers ──────────────────────────────────

const MATCHMAKER_IDS = ['mm_001', 'mm_002', 'mm_003'];

function generateAllCustomers(): Customer[] {
  _seed = 42; // Reset seed for consistency
  const customers: Customer[] = [];

  for (let i = 0; i < 60; i++) {
    customers.push(generateCustomer(i, 'Male', pick(MATCHMAKER_IDS)));
  }
  for (let i = 0; i < 60; i++) {
    customers.push(generateCustomer(i, 'Female', pick(MATCHMAKER_IDS)));
  }

  return customers;
}

export const customers: Customer[] = generateAllCustomers();

// ─── Sample Notes ─────────────────────────────────────────────

const noteTemplates = [
  'Had a detailed consultation call. Client is clear about preferences — wants someone from a similar cultural background with shared family values.',
  'Follow-up call completed. Client is open to expanding location preferences to include Pune and Hyderabad.',
  'Shared 3 profiles. Client showed interest in Profile #2. Scheduling a meeting for next week.',
  'Client mentioned they are particularly looking for someone who is career-oriented but family-first.',
  'Parents joined the call today. They emphasized the importance of religious compatibility.',
  'Client requested to pause matchmaking for 2 weeks due to work commitments. Will resume in June.',
  'Excellent feedback on the last introduction. Both parties are excited to meet.',
  'Client updated their preferences — now open to someone with children from a previous marriage.',
  'Discussed relocation expectations. Client can move to Bangalore or Mumbai for the right match.',
  'Birthday coming up next month. Send wishes and check in about matchmaking progress.',
  'Client is very responsive and engaged. High-priority profile for matching.',
  'Had a good conversation about their ideal partner. Updated profile with more details.',
  'Client is looking for someone with a postgraduate degree, preferably MBA or M.Tech.',
  'Parents are supportive but want someone from the same community. Noted.',
  'Client travels frequently for work. Prefers video calls for initial meetings.',
];

export function generateNotes(): Note[] {
  _seed = 100;
  const notes: Note[] = [];
  const selectedCustomers = customers.slice(0, 40);

  selectedCustomers.forEach((customer, idx) => {
    const numNotes = randomInt(1, 4);
    for (let i = 0; i < numNotes; i++) {
      const mm = pick(matchmakers);
      notes.push({
        id: `note_${idx}_${i}`,
        customerId: customer.id,
        authorId: mm.id,
        authorName: mm.name,
        content: pick(noteTemplates),
        createdAt: randomRecentDate(60),
        updatedAt: randomRecentDate(30),
      });
    }
  });

  return notes;
}

export const notes: Note[] = generateNotes();

// ─── Sample Activities ────────────────────────────────────────

export function generateActivities(): Activity[] {
  _seed = 200;
  const activities: Activity[] = [];
  const recentCustomers = customers.slice(0, 25);

  const templates: Array<{ type: ActivityType; desc: (name: string) => string }> = [
    { type: 'note_added', desc: (name) => `Added a new note for ${name}` },
    { type: 'match_sent', desc: (name) => `Sent a match recommendation to ${name}` },
    { type: 'match_generated', desc: (name) => `Generated new matches for ${name}` },
    { type: 'profile_updated', desc: (name) => `Updated profile information for ${name}` },
    { type: 'journey_updated', desc: (name) => `${name} moved to next journey stage` },
    { type: 'introduction_sent', desc: (name) => `Sent introduction email for ${name}` },
    { type: 'call_logged', desc: (name) => `Logged a consultation call with ${name}` },
  ];

  recentCustomers.forEach((customer, idx) => {
    const numActivities = randomInt(1, 3);
    for (let i = 0; i < numActivities; i++) {
      const template = pick(templates);
      activities.push({
        id: `act_${idx}_${i}`,
        matchmakerId: customer.matchmakerId,
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        actionType: template.type,
        description: template.desc(`${customer.firstName} ${customer.lastName}`),
        createdAt: randomRecentDate(14),
      });
    }
  });

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return activities;
}

export const activities: Activity[] = generateActivities();
