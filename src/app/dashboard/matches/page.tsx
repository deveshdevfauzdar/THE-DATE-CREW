'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Search, Users, ArrowRight } from 'lucide-react';
import { Customer } from '@/types';
import * as store from '@/lib/store';
import { cn, getInitials, formatIncome, getStageClassName } from '@/lib/utils';

export default function MatchesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const all = store.getCustomers();
      setCustomers(all);
      setIsLoading(false);
    }, 300);
  }, []);

  const filtered = customers.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(s) || c.city.toLowerCase().includes(s);
  });

  const activeMatching = filtered.filter(c =>
    ['Active Matching', 'Introduction Sent', 'Meeting Scheduled'].includes(c.journeyStatus)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Matches</h1>
        <p className="text-text-secondary text-sm mt-1">View and manage match recommendations for your customers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Customers with Active Matching */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Active Matchmaking ({activeMatching.length})
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div>
                    <div className="skeleton h-4 w-28 mb-1" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="skeleton h-8 w-full rounded-xl mt-3" />
              </div>
            ))}
          </div>
        ) : activeMatching.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border">
            <Heart className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No active matchmaking</p>
            <p className="text-text-tertiary text-sm mt-1">Start matching from a customer&apos;s profile</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMatching.map((customer, idx) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-surface rounded-2xl border border-border p-5 card-hover"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold',
                    customer.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                  )}>
                    {getInitials(customer.firstName, customer.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-xs text-text-tertiary">{customer.age}y · {customer.city}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-1 rounded-full', getStageClassName(customer.journeyStatus))}>
                    {customer.journeyStatus}
                  </span>
                </div>

                <p className="text-xs text-text-secondary mb-3">{customer.designation} · {formatIncome(customer.annualIncome)}</p>

                <Link
                  href={`/dashboard/customers/${customer.id}?tab=matches`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  View Matches <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* All Customers */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          All Customers ({filtered.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.slice(0, 20).map((customer) => (
            <Link
              key={customer.id}
              href={`/dashboard/customers/${customer.id}?tab=matches`}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-primary/30 hover:bg-primary-50/20 transition-all"
            >
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0',
                customer.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
              )}>
                {getInitials(customer.firstName, customer.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{customer.firstName} {customer.lastName}</p>
                <p className="text-xs text-text-tertiary">{customer.age}y · {customer.city}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-tertiary shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
