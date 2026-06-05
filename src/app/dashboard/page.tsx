'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Heart, Send, Trophy, Clock, Search, Filter,
  ChevronLeft, ChevronRight, ChevronDown, Eye, MessageSquare,
  ArrowUpDown, X, SlidersHorizontal
} from 'lucide-react';
import { Customer, FilterState, DashboardStats, Activity } from '@/types';
import * as store from '@/lib/store';
import {
  formatRelativeTime, formatIncome, formatHeight, getStageClassName,
  getPriorityClassName, cn, getInitials
} from '@/lib/utils';
import {
  FileText, Mail, Sparkles, User, MapPin, Diamond, Phone
} from 'lucide-react';

// ─── Stats Card Component ────────────────────────────────────

function StatsCard({ title, value, icon: Icon, color, delay }: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface rounded-2xl p-5 border border-border shadow-sm card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Activity Item Component ────────────────────────────────

function ActivityItem({ activity }: { activity: Activity }) {
  const iconMap: Record<string, React.ElementType> = {
    note_added: FileText,
    match_sent: Mail,
    match_generated: Sparkles,
    profile_updated: User,
    journey_updated: MapPin,
    introduction_sent: Diamond,
    call_logged: Phone,
  };

  const Icon = iconMap[activity.actionType] || FileText;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-lg bg-primary-50 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary leading-snug">{activity.description}</p>
        <p className="text-xs text-text-tertiary mt-1">{formatRelativeTime(activity.createdAt)}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Partial<FilterState>>({
    search: '',
    gender: 'All',
    city: 'All',
    religion: 'All',
    journeyStatus: 'All',
    maritalStatus: 'All',
    sortBy: 'firstName',
    sortOrder: 'asc',
    page: 1,
    pageSize: 10,
  });

  const cities = useMemo(() => store.getUniqueCities(), []);
  const religions = useMemo(() => store.getUniqueReligions(), []);

  const loadData = useCallback(() => {
    setIsLoading(true);
    // Simulate slight delay for realism
    setTimeout(() => {
      setStats(store.getDashboardStats());
      const result = store.getFilteredCustomers(filters);
      setCustomers(result.customers);
      setTotalCustomers(result.total);
      setActivities(store.getRecentActivities(10));
      setIsLoading(false);
    }, 300);
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(totalCustomers / (filters.pageSize || 10));

  const updateFilter = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const activeFilterCount = [
    filters.gender !== 'All',
    filters.city !== 'All',
    filters.religion !== 'All',
    filters.journeyStatus !== 'All',
    filters.maritalStatus !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Overview of your matchmaking operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats ? (
          <>
            <StatsCard title="Total Customers" value={stats.totalCustomers} icon={Users} color="bg-blue-50 text-blue-600" delay={0} />
            <StatsCard title="Active Matches" value={stats.activeMatches} icon={Heart} color="bg-pink-50 text-pink-600" delay={0.1} />
            <StatsCard title="Intros Sent" value={stats.introductionsSent} icon={Send} color="bg-amber-50 text-amber-600" delay={0.2} />
            <StatsCard title="Success Stories" value={stats.successStories} icon={Trophy} color="bg-green-50 text-green-600" delay={0.3} />
            <StatsCard title="Pending Reviews" value={stats.pendingReviews} icon={Clock} color="bg-purple-50 text-purple-600" delay={0.4} />
          </>
        ) : (
          // Skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl p-5 border border-border">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Customer Table */}
        <div className="flex-1 min-w-0 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search by name, city, company..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  id="customer-search"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  showFilters || activeFilterCount > 0
                    ? 'border-primary bg-primary-50 text-primary'
                    : 'border-border text-text-secondary hover:bg-primary-50'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Row */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap items-center gap-3"
              >
                <select
                  value={filters.gender || 'All'}
                  onChange={(e) => updateFilter('gender', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <select
                  value={filters.city || 'All'}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={filters.religion || 'All'}
                  onChange={(e) => updateFilter('religion', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Religions</option>
                  {religions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <select
                  value={filters.journeyStatus || 'All'}
                  onChange={(e) => updateFilter('journeyStatus', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Stages</option>
                  <option value="Lead">Lead</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Verified">Verified</option>
                  <option value="Active Matching">Active Matching</option>
                  <option value="Introduction Sent">Introduction Sent</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="Relationship Progressing">Progressing</option>
                  <option value="Success">Success</option>
                </select>

                <select
                  value={filters.maritalStatus || 'All'}
                  onChange={(e) => updateFilter('maritalStatus', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">Marital Status</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev, gender: 'All', city: 'All', religion: 'All',
                      journeyStatus: 'All', maritalStatus: 'All', page: 1,
                    }))}
                    className="text-xs text-primary hover:text-primary-hover font-medium"
                  >
                    Clear all
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary-50/30">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Profile</th>
                  <th
                    className="text-left py-3 px-4 text-text-secondary font-medium cursor-pointer hover:text-primary"
                    onClick={() => handleSort('age')}
                  >
                    <span className="flex items-center gap-1">Age <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden md:table-cell">City</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden lg:table-cell">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden xl:table-cell">Journey</th>
                  <th
                    className="text-left py-3 px-4 text-text-secondary font-medium hidden xl:table-cell cursor-pointer hover:text-primary"
                    onClick={() => handleSort('annualIncome')}
                  >
                    <span className="flex items-center gap-1">Income <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium hidden lg:table-cell">Last Contact</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="skeleton w-9 h-9 rounded-full" /><div><div className="skeleton h-4 w-28 mb-1" /><div className="skeleton h-3 w-20" /></div></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-4 w-8" /></td>
                      <td className="py-3 px-4 hidden md:table-cell"><div className="skeleton h-4 w-16" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><div className="skeleton h-5 w-20 rounded-full" /></td>
                      <td className="py-3 px-4 hidden xl:table-cell"><div className="skeleton h-5 w-24 rounded-full" /></td>
                      <td className="py-3 px-4 hidden xl:table-cell"><div className="skeleton h-4 w-16" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><div className="skeleton h-4 w-14" /></td>
                      <td className="py-3 px-4"><div className="skeleton h-8 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                      <p className="text-text-secondary font-medium">No customers found</p>
                      <p className="text-text-tertiary text-xs mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer, idx) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-border/50 hover:bg-primary-50/20 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                            customer.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          )}>
                            {getInitials(customer.firstName, customer.lastName)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/customers/${customer.id}`}
                              className="text-sm font-medium text-text-primary hover:text-primary transition-colors truncate block"
                            >
                              {customer.firstName} {customer.lastName}
                            </Link>
                            <p className="text-xs text-text-tertiary truncate">
                              {customer.designation} · {customer.gender}
                            </p>
                          </div>
                          {customer.priorityTag !== 'Standard' && (
                            <span className={cn(
                              'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline',
                              getPriorityClassName(customer.priorityTag)
                            )}>
                              {customer.priorityTag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-primary">{customer.age}</td>
                      <td className="py-3 px-4 text-text-secondary hidden md:table-cell">{customer.city}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-block"
                          style={{
                            backgroundColor: customer.maritalStatus === 'Never Married' ? '#F0FDF4' : '#FEF3C7',
                            color: customer.maritalStatus === 'Never Married' ? '#166534' : '#92400E',
                          }}
                        >
                          {customer.maritalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full inline-block', getStageClassName(customer.journeyStatus))}>
                          {customer.journeyStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-secondary hidden xl:table-cell">{formatIncome(customer.annualIncome)}</td>
                      <td className="py-3 px-4 text-text-tertiary text-xs hidden lg:table-cell">{formatRelativeTime(customer.lastContacted)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            className="p-2 rounded-lg hover:bg-primary-50 text-text-tertiary hover:text-primary transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/customers/${customer.id}?tab=matches`}
                            className="p-2 rounded-lg hover:bg-pink-50 text-text-tertiary hover:text-pink-600 transition-colors"
                            title="View Matches"
                          >
                            <Heart className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/customers/${customer.id}?tab=notes`}
                            className="p-2 rounded-lg hover:bg-amber-50 text-text-tertiary hover:text-amber-600 transition-colors"
                            title="Add Note"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-text-tertiary">
                Showing {((filters.page || 1) - 1) * (filters.pageSize || 10) + 1}–{Math.min((filters.page || 1) * (filters.pageSize || 10), totalCustomers)} of {totalCustomers}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                  disabled={(filters.page || 1) <= 1}
                  className="p-2 rounded-lg border border-border hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setFilters(prev => ({ ...prev, page }))}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                        (filters.page || 1) === page
                          ? 'bg-primary text-white'
                          : 'hover:bg-primary-50 text-text-secondary'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-text-tertiary">...</span>}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, (prev.page || 1) + 1) }))}
                  disabled={(filters.page || 1) >= totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:w-[340px] bg-surface rounded-2xl border border-border shadow-sm p-5"
        >
          <h3 className="text-base font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-0">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
                <p className="text-text-tertiary text-sm">No recent activity</p>
              </div>
            ) : (
              activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
