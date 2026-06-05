// ============================================================
// Utility Functions
// ============================================================

import { JourneyStage } from '@/types';

/** Format date to readable string */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format date to relative time */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

/** Format height in cm to feet-inches */
export function formatHeight(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

/** Format income in LPA */
export function formatIncome(lpa: number): string {
  if (lpa >= 100) return `₹${(lpa / 100).toFixed(1)} Cr`;
  return `₹${lpa} LPA`;
}

/** Format phone number */
export function formatPhone(phone: string): string {
  return phone;
}

/** Get initials from name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Journey stage CSS class */
export function getStageClassName(stage: JourneyStage): string {
  const map: Record<JourneyStage, string> = {
    'Lead': 'stage-lead',
    'Consultation': 'stage-consultation',
    'Verified': 'stage-verified',
    'Active Matching': 'stage-matching',
    'Introduction Sent': 'stage-intro-sent',
    'Meeting Scheduled': 'stage-meeting',
    'Relationship Progressing': 'stage-progressing',
    'Success': 'stage-success',
  };
  return map[stage] || 'stage-lead';
}

/** Priority tag CSS class */
export function getPriorityClassName(tag: string): string {
  const map: Record<string, string> = {
    'Standard': 'priority-standard',
    'Premium': 'priority-premium',
    'VIP': 'priority-vip',
  };
  return map[tag] || 'priority-standard';
}

/** Get score color class */
export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-700';
  if (score >= 55) return 'text-amber-700';
  return 'text-red-700';
}

/** Get score bg color class */
export function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-green-50 border-green-200';
  if (score >= 55) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/** CN utility for conditional class names */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
