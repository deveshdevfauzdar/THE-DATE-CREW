'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, GraduationCap, Phone, Mail, Heart,
  Calendar, Ruler, Users, BookOpen, Languages, Home, Baby, Dog,
  UtensilsCrossed, Cigarette, Wine, Star, Sparkles, Send, Edit2,
  Trash2, Plus, Check, X, Clock, MessageSquare, ChevronRight,
  Shield, Target, TrendingUp, Lightbulb, CheckCircle2, AlertTriangle,
  Zap, MessageCircle, Brain
} from 'lucide-react';
import { Customer, Note, Match } from '@/types';
import * as store from '@/lib/store';
import * as ai from '@/lib/ai';
import { generateMatches, getScoreLabel } from '@/lib/matching/engine';
import {
  formatDate, formatHeight, formatIncome, formatRelativeTime,
  getStageClassName, getPriorityClassName, cn, getInitials,
  getScoreColor, getScoreBgColor, truncate
} from '@/lib/utils';
import type { ProfileSummary, CompatibilityAnalysis, MatchInsights, GeneratedIntroduction } from '@/types';

// ─── Section Card ────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children, className }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-border shadow-sm p-5', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm text-text-primary font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}

// ─── Tags ────────────────────────────────────────────────────

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <span key={item} className="text-xs px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 font-medium">
          {item}
        </span>
      ))}
    </div>
  );
}

// ─── Customer Profile Page ───────────────────────────────────

export default function CustomerProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchedProfiles, setMatchedProfiles] = useState<Record<string, Customer>>({});
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isLoading, setIsLoading] = useState(true);

  // AI states
  const [aiSummary, setAiSummary] = useState<ProfileSummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Note form
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Match modal
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [matchInsights, setMatchInsights] = useState<MatchInsights | null>(null);
  const [introduction, setIntroduction] = useState<GeneratedIntroduction | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [noteAnalysis, setNoteAnalysis] = useState<string | null>(null);
  const [isAnalyzingNotes, setIsAnalyzingNotes] = useState(false);

  // Load data
  useEffect(() => {
    setIsLoading(true);
    const c = store.getCustomerById(customerId);
    if (c) {
      setCustomer(c);
      setNotes(store.getNotesByCustomer(customerId));

      // Load or generate matches
      let existingMatches = store.getMatchesByCustomer(customerId);
      if (existingMatches.length === 0) {
        existingMatches = generateMatches(customerId, 10);
        if (existingMatches.length > 0) {
          store.saveMatches(existingMatches);
        }
      }
      setMatches(existingMatches);

      // Load matched profiles
      const profiles: Record<string, Customer> = {};
      existingMatches.forEach(m => {
        const p = store.getCustomerById(m.matchedCustomerId);
        if (p) profiles[p.id] = p;
      });
      setMatchedProfiles(profiles);
    }
    setIsLoading(false);
  }, [customerId]);

  // Load AI summary
  const loadAiSummary = useCallback(async () => {
    if (!customer || aiSummary) return;
    setAiLoading(true);
    try {
      const summary = await ai.getProfileSummary(customer);
      setAiSummary(summary);
    } catch (e) {
      console.error('Failed to load AI summary', e);
    } finally {
      setAiLoading(false);
    }
  }, [customer, aiSummary]);

  useEffect(() => {
    if (customer && activeTab === 'profile') {
      loadAiSummary();
    }
  }, [customer, activeTab, loadAiSummary]);

  // Notes CRUD
  const handleAddNote = () => {
    if (!newNote.trim() || !customer) return;
    const note: Note = {
      id: `note_${Date.now()}`,
      customerId: customer.id,
      authorId: 'mm_001',
      authorName: 'Priya Kapoor',
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addNote(note);
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const handleEditNote = (noteId: string) => {
    if (!editContent.trim()) return;
    store.updateNote(noteId, editContent.trim());
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, content: editContent.trim(), updatedAt: new Date().toISOString() } : n));
    setEditingNoteId(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    store.deleteNote(noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleProcessNotes = async () => {
    if (!customer || notes.length === 0) return;
    setIsAnalyzingNotes(true);
    try {
      const analysis = await ai.processNotes(notes, customer);
      setNoteAnalysis(analysis);
    } catch (e) {
      console.error('Failed to process notes', e);
    } finally {
      setIsAnalyzingNotes(false);
    }
  };

  // Match actions
  const handleViewMatch = async (match: Match) => {
    setSelectedMatch(match);
    setMatchAnalysis(null);
    setMatchInsights(null);
    setIntroduction(null);
    setModalLoading(true);

    const matched = matchedProfiles[match.matchedCustomerId];
    if (customer && matched) {
      try {
        const [analysis, insights] = await Promise.all([
          ai.getCompatibilityAnalysis(customer, matched, match.compatibilityScore),
          ai.getMatchInsights(customer, matched),
        ]);
        setMatchAnalysis(analysis);
        setMatchInsights(insights);
      } catch (e) {
        console.error('Failed to load match analysis', e);
      }
    }
    setModalLoading(false);
  };

  const handleGenerateIntro = async () => {
    if (!selectedMatch || !customer) return;
    setModalLoading(true);
    const matched = matchedProfiles[selectedMatch.matchedCustomerId];
    if (matched) {
      try {
        const intro = await ai.getIntroduction(customer, matched);
        setIntroduction(intro);
      } catch (e) {
        console.error('Failed to generate introduction', e);
      }
    }
    setModalLoading(false);
  };

  const handleSendMatch = () => {
    if (!selectedMatch) return;
    store.updateMatchStatus(selectedMatch.id, 'sent');
    setMatches(prev => prev.map(m => m.id === selectedMatch.id ? { ...m, status: 'sent', sentAt: new Date().toISOString() } : m));
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setShowSendModal(false);
      setSelectedMatch(null);
    }, 2500);
  };

  if (isLoading || !customer) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 w-full rounded-2xl" />
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: Users },
    { key: 'matches', label: 'Matches', icon: Heart },
    { key: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-2xl border border-border shadow-sm p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0',
            customer.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
          )}>
            {getInitials(customer.firstName, customer.lastName)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-text-primary">
                {customer.firstName} {customer.lastName}
              </h1>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', getPriorityClassName(customer.priorityTag))}>
                {customer.priorityTag}
              </span>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', getStageClassName(customer.journeyStatus))}>
                {customer.journeyStatus}
              </span>
              {customer.verificationStatus === 'Verified' && (
                <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary mt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {customer.age} years</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {customer.city}, {customer.state}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {customer.designation} at {customer.currentCompany}</span>
              <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4" /> {formatHeight(customer.heightCm)}</span>
            </div>

            <p className="text-sm text-text-tertiary mt-3 max-w-2xl">{customer.aboutMe}</p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 shrink-0">
            <div className="text-center px-4 py-2 rounded-xl bg-primary-50">
              <p className="text-2xl font-bold text-primary">{customer.engagementScore}</p>
              <p className="text-[11px] text-text-secondary">Engagement</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-primary-50">
              <p className="text-2xl font-bold text-primary">{matches.length}</p>
              <p className="text-[11px] text-text-secondary">Matches</p>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary-700">AI Matchmaker Summary</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">{aiSummary.summary}</p>
            <p className="text-xs text-primary-600 mt-2 italic flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> {aiSummary.matchmakingAdvice}</p>
          </motion.div>
        )}
        {aiLoading && (
          <div className="mt-4 p-4 rounded-xl bg-primary-50 border border-primary-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm text-primary-600">AI is analyzing this profile...</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-primary hover:bg-primary-50'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.key === 'notes' && notes.length > 0 && (
              <span className={cn(
                'w-5 h-5 rounded-full text-[10px] flex items-center justify-center',
                activeTab === tab.key ? 'bg-white/20' : 'bg-primary-100 text-primary'
              )}>
                {notes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Personal Information */}
            <SectionCard title="Personal Information" icon={Users}>
              <InfoRow label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
              <InfoRow label="Gender" value={customer.gender} />
              <InfoRow label="Date of Birth" value={formatDate(customer.dateOfBirth)} />
              <InfoRow label="Age" value={`${customer.age} years`} />
              <InfoRow label="Height" value={formatHeight(customer.heightCm)} />
              <InfoRow label="Weight" value={`${customer.weightKg} kg`} />
              <InfoRow label="Mother Tongue" value={customer.motherTongue} />
              <InfoRow label="Profile Created By" value={customer.profileCreatedBy} />
            </SectionCard>

            {/* Contact */}
            <SectionCard title="Contact Information" icon={Phone}>
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="Phone" value={customer.phone} />
              <InfoRow label="Location" value={`${customer.city}, ${customer.state}, ${customer.country}`} />
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education" icon={GraduationCap}>
              <InfoRow label="School" value={customer.school} />
              <InfoRow label="College" value={customer.undergraduateCollege} />
              <InfoRow label="Degree" value={customer.degree} />
              <InfoRow label="Highest Qualification" value={customer.highestQualification} />
            </SectionCard>

            {/* Career */}
            <SectionCard title="Career" icon={Briefcase}>
              <InfoRow label="Company" value={customer.currentCompany} />
              <InfoRow label="Designation" value={customer.designation} />
              <InfoRow label="Industry" value={customer.industry} />
              <InfoRow label="Annual Income" value={formatIncome(customer.annualIncome)} />
            </SectionCard>

            {/* Family */}
            <SectionCard title="Family" icon={Home}>
              <InfoRow label="Marital Status" value={customer.maritalStatus} />
              <InfoRow label="Siblings" value={customer.numberOfSiblings} />
              <InfoRow label="Family Type" value={customer.familyType} />
              <InfoRow label="Family Values" value={customer.familyValues} />
              <InfoRow label="Family Location" value={customer.familyLocation} />
              <InfoRow label="Father's Occupation" value={customer.fatherOccupation} />
              <InfoRow label="Mother's Occupation" value={customer.motherOccupation} />
            </SectionCard>

            {/* Preferences */}
            <SectionCard title="Preferences" icon={Star}>
              <InfoRow label="Religion" value={customer.religion} />
              <InfoRow label="Caste" value={customer.caste} />
              <InfoRow label="Languages" value={customer.languages.join(', ')} />
              <InfoRow label="Want Kids" value={customer.wantKids} />
              <InfoRow label="Open to Relocate" value={customer.openToRelocate} />
              <InfoRow label="Open to Pets" value={customer.openToPets} />
              <InfoRow label="Diet" value={customer.dietaryPreference} />
              <InfoRow label="Smoking" value={customer.smokingPreference} />
              <InfoRow label="Drinking" value={customer.drinkingPreference} />
              <InfoRow label="Manglik" value={customer.manglikStatus} />
            </SectionCard>

            {/* Personality */}
            <SectionCard title="Personality & Lifestyle" icon={Target} className="lg:col-span-2 xl:col-span-1">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-2">Lifestyle</p>
                  <p className="text-sm text-text-primary font-medium">{customer.lifestyle}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">Relationship Goals</p>
                  <p className="text-sm text-text-primary">{customer.relationshipGoals}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">Hobbies</p>
                  <TagList items={customer.hobbies} />
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">Interests</p>
                  <TagList items={customer.interests} />
                </div>
              </div>
            </SectionCard>

            {/* Partner Preferences */}
            <SectionCard title="Partner Preferences" icon={Heart}>
              <InfoRow label="Age Range" value={`${customer.partnerPreferences.ageMin} – ${customer.partnerPreferences.ageMax} years`} />
              <InfoRow label="Height Range" value={`${formatHeight(customer.partnerPreferences.heightMin)} – ${formatHeight(customer.partnerPreferences.heightMax)}`} />
              <InfoRow label="Income Range" value={`${formatIncome(customer.partnerPreferences.incomeMin)} – ${formatIncome(customer.partnerPreferences.incomeMax)}`} />
              <InfoRow label="Education" value={customer.partnerPreferences.preferredEducation} />
              <InfoRow label="Location" value={customer.partnerPreferences.preferredLocations.join(', ')} />
              <InfoRow label="Religion" value={customer.partnerPreferences.preferredReligion} />
              <InfoRow label="Caste" value={customer.partnerPreferences.preferredCaste} />
            </SectionCard>

            {/* Journey Tracker */}
            <SectionCard title="Journey Tracker" icon={TrendingUp}>
              <div className="space-y-3">
                {customer.journeyHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-3 h-3 rounded-full shrink-0 mt-1',
                        idx === customer.journeyHistory.length - 1 ? 'bg-primary' : 'bg-border'
                      )} />
                      {idx < customer.journeyHistory.length - 1 && (
                        <div className="w-px h-8 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full inline-block',
                        getStageClassName(entry.stage)
                      )}>
                        {entry.stage}
                      </span>
                      <p className="text-xs text-text-tertiary mt-1">{formatDate(entry.enteredAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <motion.div
            key="matches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches.map((match, idx) => {
                const matched = matchedProfiles[match.matchedCustomerId];
                if (!matched) return null;
                const scoreInfo = getScoreLabel(match.compatibilityScore);

                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-surface rounded-2xl border border-border shadow-sm p-5 card-hover"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center font-bold',
                          matched.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        )}>
                          {getInitials(matched.firstName, matched.lastName)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">{matched.firstName} {matched.lastName}</h4>
                          <p className="text-xs text-text-tertiary">{matched.age}y · {matched.city}</p>
                        </div>
                      </div>
                      <div className={cn(
                        'text-center px-3 py-1.5 rounded-xl border',
                        getScoreBgColor(match.compatibilityScore)
                      )}>
                        <p className={cn('text-lg font-bold', getScoreColor(match.compatibilityScore))}>
                          {Math.round(match.compatibilityScore)}
                        </p>
                        <p className="text-[10px] text-text-tertiary">/ 100</p>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary mb-3">{matched.designation} at {matched.currentCompany}</p>

                    {/* Score breakdown mini */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Object.entries(match.scoreBreakdown).filter(([k]) => k !== 'total').map(([key, value]) => (
                        <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {typeof value === 'number' ? Math.round(value) : value}
                        </span>
                      ))}
                    </div>

                    {/* Status badge */}
                    {match.status === 'sent' && (
                      <div className="mb-3 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg">
                        <Check className="w-3 h-3" /> Sent {match.sentAt ? formatRelativeTime(match.sentAt) : ''}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewMatch(match)}
                        className="flex-1 text-xs font-medium py-2 rounded-xl bg-primary-50 text-primary hover:bg-primary-100 transition-colors text-center"
                      >
                        View Details
                      </button>
                      <Link
                        href={`/dashboard/customers/${matched.id}`}
                        className="flex-1 text-xs font-medium py-2 rounded-xl border border-border text-text-secondary hover:bg-primary-50 hover:text-primary transition-colors text-center"
                      >
                        View Profile
                      </Link>
                      {match.status !== 'sent' && (
                        <button
                          onClick={() => {
                            setSelectedMatch(match);
                            setShowSendModal(true);
                          }}
                          className="flex-1 text-xs font-medium py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors text-center flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Send
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {matches.length === 0 && (
              <div className="text-center py-16 bg-surface rounded-2xl border border-border">
                <Heart className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                <p className="text-text-secondary font-medium">No matches generated yet</p>
                <p className="text-text-tertiary text-sm mt-1">Matches are being calculated...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Add Note Form */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Add a Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note about this customer..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                id="new-note-input"
              />
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={handleProcessNotes}
                  disabled={isAnalyzingNotes || notes.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-primary bg-primary-50 text-sm font-medium rounded-xl hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAnalyzingNotes ? 'Analyzing...' : 'AI Process Notes'}
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            </div>

            {/* AI Note Analysis Result */}
            <AnimatePresence>
              {noteAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-purple-50 border border-purple-100 rounded-2xl p-5"
                >
                  <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4" /> AI Note Synthesis
                  </h3>
                  <p className="text-sm text-purple-900/80 leading-relaxed">
                    {noteAnalysis}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes List */}
            {notes.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-border">
                <MessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                <p className="text-text-secondary font-medium">No notes yet</p>
                <p className="text-text-tertiary text-sm mt-1">Add your first note above</p>
              </div>
            ) : (
              notes.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  className="bg-surface rounded-2xl border border-border shadow-sm p-5"
                >
                  {editingNoteId === note.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingNoteId(null)} className="px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-lg">Cancel</button>
                        <button onClick={() => handleEditNote(note.id)} className="px-4 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover">Save</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-text-primary leading-relaxed">{note.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-semibold text-primary">
                            {note.authorName.charAt(0)}
                          </div>
                          <span className="text-xs text-text-secondary">{note.authorName}</span>
                          <span className="text-xs text-text-tertiary">· {formatRelativeTime(note.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingNoteId(note.id); setEditContent(note.content); }}
                            className="p-1.5 rounded-lg hover:bg-primary-50 text-text-tertiary hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 rounded-lg hover:bg-danger-light text-text-tertiary hover:text-danger transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatch && !showSendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Match Details</h2>
                <button onClick={() => setSelectedMatch(null)} className="p-2 rounded-lg hover:bg-primary-50">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {modalLoading ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-text-secondary">AI is analyzing compatibility...</p>
                  </div>
                ) : (
                  <>
                    {/* Compatibility Analysis */}
                    {matchAnalysis && (
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" /> AI Compatibility Analysis
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">{matchAnalysis.explanation}</p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                            <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Strengths</p>
                            <ul className="space-y-1">
                              {matchAnalysis.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-green-700">{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Concerns</p>
                            <ul className="space-y-1">
                              {matchAnalysis.concerns.map((c, i) => (
                                <li key={i} className="text-xs text-amber-700">{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Match Insights */}
                    {matchInsights && (
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Match Insights</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl bg-green-50/50">
                            <p className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Green Flags</p>
                            <ul className="space-y-1">
                              {matchInsights.greenFlags.map((f, i) => (
                                <li key={i} className="text-xs text-text-secondary">• {f}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-xl bg-red-50/50">
                            <p className="text-xs font-semibold text-red-800 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Red Flags</p>
                            <ul className="space-y-1">
                              {matchInsights.redFlags.map((f, i) => (
                                <li key={i} className="text-xs text-text-secondary">• {f}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-xl bg-amber-50/50">
                            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1"><Zap className="w-4 h-4" /> Challenges</p>
                            <ul className="space-y-1">
                              {matchInsights.potentialChallenges.map((c, i) => (
                                <li key={i} className="text-xs text-text-secondary">• {c}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-xl bg-blue-50/50">
                            <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Conversation Starters</p>
                            <ul className="space-y-1">
                              {matchInsights.conversationStarters.map((c, i) => (
                                <li key={i} className="text-xs text-text-secondary">• {c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Introduction Generator */}
                    <div>
                      {introduction ? (
                        <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary-700">Generated Introduction</span>
                          </div>
                          <p className="text-xs font-medium text-primary-800 mb-2">Subject: {introduction.subject}</p>
                          <pre className="text-xs text-text-primary whitespace-pre-wrap font-sans leading-relaxed">{introduction.body}</pre>
                        </div>
                      ) : (
                        <button
                          onClick={handleGenerateIntro}
                          disabled={modalLoading}
                          className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Introduction Email
                        </button>
                      )}
                    </div>

                    {/* Send Match Button */}
                    {selectedMatch.status !== 'sent' && (
                      <button
                        onClick={() => setShowSendModal(true)}
                        className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Match to Customer
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Match Confirmation Modal */}
      <AnimatePresence>
        {showSendModal && selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => !sendSuccess && setShowSendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {sendSuccess ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Match Sent Successfully!</h3>
                  <p className="text-sm text-text-secondary">The introduction email has been sent to the customer.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Send Match</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    This will send an introduction email to {customer.firstName} about this match.
                  </p>

                  {(() => {
                    const matched = matchedProfiles[selectedMatch.matchedCustomerId];
                    if (!matched) return null;
                    return (
                      <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm',
                            matched.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          )}>
                            {getInitials(matched.firstName, matched.lastName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{matched.firstName} {matched.lastName}</p>
                            <p className="text-xs text-text-secondary">{matched.age}y · {matched.city} · {matched.designation}</p>
                          </div>
                          <div className={cn('ml-auto text-lg font-bold', getScoreColor(selectedMatch.compatibilityScore))}>
                            {Math.round(selectedMatch.compatibilityScore)}%
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSendModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-primary-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMatch}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Confirm & Send
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
