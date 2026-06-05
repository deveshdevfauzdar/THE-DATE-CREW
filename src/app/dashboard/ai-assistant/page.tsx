'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Send, Brain, MessageSquare, Lightbulb, Users, ArrowRight } from 'lucide-react';
import * as store from '@/lib/store';
import type { Customer } from '@/types';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Customer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    // Simulate AI network delay
    setTimeout(() => {
      const allCustomers = store.getCustomers();
      const q = query.toLowerCase();
      
      const matched = allCustomers.filter(c => {
        let score = 0;
        const textToSearch = `${c.firstName} ${c.lastName} ${c.city} ${c.designation} ${c.industry} ${c.religion} ${c.caste} ${c.lifestyle} ${c.familyValues} ${c.dietaryPreference} ${c.hobbies.join(' ')}`.toLowerCase();
        
        // Simple heuristic keyword matching simulating an LLM rule engine
        const words = q.split(/\s+/);
        for (const w of words) {
          if (w.length > 2 && textToSearch.includes(w)) {
            score++;
          }
        }
        
        // Specific natural language rules
        if (q.includes('engineer') && (c.designation.toLowerCase().includes('engineer') || c.industry.toLowerCase().includes('tech'))) score += 2;
        if (q.includes('doctor') && c.designation.toLowerCase().includes('doctor')) score += 2;
        if (q.includes('vegetarian') && c.dietaryPreference === 'Vegetarian') score += 2;
        if (q.includes('mumbai') && c.city === 'Mumbai') score += 2;
        if (q.includes('traditional') && c.familyValues === 'Traditional') score += 2;
        if (q.includes('kids') && c.wantKids === 'Yes') score += 1;

        return score > 0;
      });

      setResults(matched.slice(0, 8)); // Top 8 matches
      setIsSearching(false);
    }, 1200);
  }, [query]);

  const features = [
    {
      icon: Brain,
      title: 'AI Compatibility Analysis',
      description: 'Get detailed compatibility scores with strengths, concerns, and AI explanations for any match pair.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Introduction Generator',
      description: 'Generate personalized, professional introduction emails for sending match recommendations.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'Match Insights',
      description: 'Discover green flags, red flags, potential challenges, and conversation starters for matches.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Sparkles,
      title: 'Profile Summary',
      description: 'Get AI-generated quick summaries and matchmaking advice for any customer profile.',
      color: 'bg-pink-50 text-pink-600',
    },
  ];


  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Assistant
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Leverage AI-powered insights to enhance your matchmaking decisions
        </p>
      </div>


      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface rounded-2xl border border-border shadow-sm p-5"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feature.color} mb-4`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">{feature.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Natural Language Rule Engine */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-border bg-primary-50/50">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            Natural Language Profile Fit
          </h2>
          <p className="text-sm text-text-secondary">
            Describe your ideal client in natural language. Our local LLM-based rule engine will dynamically filter and extract the best fits from the database.
          </p>
        </div>
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="e.g., 'Find me traditional vegetarian engineers in Mumbai who want kids'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-24 py-4 rounded-xl border border-border bg-background text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button 
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {isSearching ? 'Thinking...' : 'Search'}
            </button>
          </div>

          <AnimatePresence>
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                {isSearching ? (
                  <div className="py-12 text-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto mb-3" />
                    <p className="text-sm text-text-secondary">AI is analyzing profiles...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-text-primary">Found {results.length} matches based on your criteria:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.map(customer => (
                        <Link 
                          key={customer.id} 
                          href={`/dashboard/customers/${customer.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-50 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm shrink-0">
                            {getInitials(customer.firstName, customer.lastName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-text-primary truncate">{customer.firstName} {customer.lastName}</h4>
                            <p className="text-xs text-text-secondary truncate">{customer.designation} · {customer.city}</p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary truncate">
                                {customer.religion}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary truncate">
                                {customer.familyValues}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-primary shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-background rounded-xl border border-border border-dashed">
                    <p className="text-sm text-text-secondary">No profiles perfectly match this exact description.</p>
                    <p className="text-xs text-text-tertiary mt-1">Try broadening your search terms.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


    </div>
  );
}
