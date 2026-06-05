// ============================================================
// Data Store — localStorage-backed with Supabase-ready interface
// ============================================================

import { Customer, Note, Match, Activity, DashboardStats, FilterState } from '@/types';
import { customers as seedCustomers, notes as seedNotes, activities as seedActivities } from '@/data/customers';

const STORAGE_KEYS = {
  CUSTOMERS: 'tdc_customers',
  NOTES: 'tdc_notes',
  MATCHES: 'tdc_matches',
  ACTIVITIES: 'tdc_activities',
  INITIALIZED: 'tdc_initialized_v2',
};

// ─── Initialize Store ────────────────────────────────────────

function initializeStore(): void {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(seedCustomers));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(seedNotes));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(seedActivities));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

function getFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  initializeStore();
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Customers ───────────────────────────────────────────────

export function getCustomers(): Customer[] {
  return getFromStorage<Customer>(STORAGE_KEYS.CUSTOMERS, seedCustomers);
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find(c => c.id === id);
}

export function getFilteredCustomers(filters: Partial<FilterState>): {
  customers: Customer[];
  total: number;
} {
  let result = getCustomers();

  // Search
  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
      c.city.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.currentCompany.toLowerCase().includes(search) ||
      c.designation.toLowerCase().includes(search)
    );
  }

  // Gender
  if (filters.gender && filters.gender !== 'All') {
    result = result.filter(c => c.gender === filters.gender);
  }

  // Age range
  if (filters.ageMin != null) {
    result = result.filter(c => c.age >= filters.ageMin!);
  }
  if (filters.ageMax != null) {
    result = result.filter(c => c.age <= filters.ageMax!);
  }

  // City
  if (filters.city && filters.city !== 'All') {
    result = result.filter(c => c.city === filters.city);
  }

  // Religion
  if (filters.religion && filters.religion !== 'All') {
    result = result.filter(c => c.religion === filters.religion);
  }

  // Caste
  if (filters.caste && filters.caste !== 'All') {
    result = result.filter(c => c.caste === filters.caste);
  }

  // Education
  if (filters.education && filters.education !== 'All') {
    result = result.filter(c => c.highestQualification === filters.education);
  }

  // Income range
  if (filters.incomeMin != null) {
    result = result.filter(c => c.annualIncome >= filters.incomeMin!);
  }
  if (filters.incomeMax != null) {
    result = result.filter(c => c.annualIncome <= filters.incomeMax!);
  }

  // Marital Status
  if (filters.maritalStatus && filters.maritalStatus !== 'All') {
    result = result.filter(c => c.maritalStatus === filters.maritalStatus);
  }

  // Children Preference
  if (filters.childrenPreference && filters.childrenPreference !== 'All') {
    result = result.filter(c => c.wantKids === filters.childrenPreference);
  }

  // Relocation Preference
  if (filters.relocationPreference && filters.relocationPreference !== 'All') {
    result = result.filter(c => c.openToRelocate === filters.relocationPreference);
  }

  // Journey Status
  if (filters.journeyStatus && filters.journeyStatus !== 'All') {
    result = result.filter(c => c.journeyStatus === filters.journeyStatus);
  }

  const total = result.length;

  // Sorting
  if (filters.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const key = filters.sortBy as keyof Customer;
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * order;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * order;
      }
      return 0;
    });
  }

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const paginated = result.slice(start, start + pageSize);

  return { customers: paginated, total };
}

// ─── Notes ───────────────────────────────────────────────────

export function getNotesByCustomer(customerId: string): Note[] {
  const allNotes = getFromStorage<Note>(STORAGE_KEYS.NOTES, seedNotes);
  return allNotes
    .filter(n => n.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNote(note: Note): void {
  const allNotes = getFromStorage<Note>(STORAGE_KEYS.NOTES, seedNotes);
  allNotes.push(note);
  saveToStorage(STORAGE_KEYS.NOTES, allNotes);
}

export function updateNote(noteId: string, content: string): void {
  const allNotes = getFromStorage<Note>(STORAGE_KEYS.NOTES, seedNotes);
  const idx = allNotes.findIndex(n => n.id === noteId);
  if (idx >= 0) {
    allNotes[idx].content = content;
    allNotes[idx].updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.NOTES, allNotes);
  }
}

export function deleteNote(noteId: string): void {
  const allNotes = getFromStorage<Note>(STORAGE_KEYS.NOTES, seedNotes);
  const filtered = allNotes.filter(n => n.id !== noteId);
  saveToStorage(STORAGE_KEYS.NOTES, filtered);
}

// ─── Matches ─────────────────────────────────────────────────

export function getMatchesByCustomer(customerId: string): Match[] {
  return getFromStorage<Match>(STORAGE_KEYS.MATCHES, [])
    .filter(m => m.customerId === customerId);
}

export function saveMatches(matches: Match[]): void {
  const existing = getFromStorage<Match>(STORAGE_KEYS.MATCHES, []);
  // Remove old matches for same customer
  const customerId = matches[0]?.customerId;
  const filtered = existing.filter(m => m.customerId !== customerId);
  saveToStorage(STORAGE_KEYS.MATCHES, [...filtered, ...matches]);
}

export function updateMatchStatus(matchId: string, status: Match['status']): void {
  const allMatches = getFromStorage<Match>(STORAGE_KEYS.MATCHES, []);
  const idx = allMatches.findIndex(m => m.id === matchId);
  if (idx >= 0) {
    allMatches[idx].status = status;
    if (status === 'sent') {
      allMatches[idx].sentAt = new Date().toISOString();
    }
    saveToStorage(STORAGE_KEYS.MATCHES, allMatches);
  }
}

// ─── Activities ──────────────────────────────────────────────

export function getRecentActivities(limit = 15): Activity[] {
  return getFromStorage<Activity>(STORAGE_KEYS.ACTIVITIES, seedActivities)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function addActivity(activity: Activity): void {
  const all = getFromStorage<Activity>(STORAGE_KEYS.ACTIVITIES, seedActivities);
  all.unshift(activity);
  saveToStorage(STORAGE_KEYS.ACTIVITIES, all.slice(0, 100)); // Keep last 100
}

// ─── Dashboard Stats ─────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  const allCustomers = getCustomers();
  const allMatches = getFromStorage<Match>(STORAGE_KEYS.MATCHES, []);

  return {
    totalCustomers: allCustomers.length,
    activeMatches: allMatches.filter(m => m.status === 'sent' || m.status === 'reviewed').length,
    introductionsSent: allMatches.filter(m => m.status === 'sent').length,
    successStories: allCustomers.filter(c => c.journeyStatus === 'Success').length,
    pendingReviews: allCustomers.filter(c =>
      c.journeyStatus === 'Lead' || c.journeyStatus === 'Consultation'
    ).length,
  };
}

// ─── Unique Values (for filters) ─────────────────────────────

export function getUniqueCities(): string[] {
  const allCustomers = getCustomers();
  return [...new Set(allCustomers.map(c => c.city))].sort();
}

export function getUniqueReligions(): string[] {
  const allCustomers = getCustomers();
  return [...new Set(allCustomers.map(c => c.religion))].sort();
}

export function getUniqueCastes(): string[] {
  const allCustomers = getCustomers();
  return [...new Set(allCustomers.map(c => c.caste))].sort();
}

export function getUniqueQualifications(): string[] {
  const allCustomers = getCustomers();
  return [...new Set(allCustomers.map(c => c.highestQualification))].sort();
}
