'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Database, RefreshCw, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'data', label: 'Data Management', icon: Database },
    { key: 'about', label: 'About', icon: Heart },
  ];

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tdc_initialized');
      localStorage.removeItem('tdc_customers');
      localStorage.removeItem('tdc_notes');
      localStorage.removeItem('tdc_matches');
      localStorage.removeItem('tdc_activities');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account and application preferences</p>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1 w-fit">
        {sections.map(section => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeSection === section.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-primary hover:bg-primary-50'
            )}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeSection === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-text-primary">Your Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{user?.name}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
              <p className="text-xs text-text-tertiary capitalize mt-1">{user?.role}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Management */}
      {activeSection === 'data' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-text-primary">Data Management</h2>
          <p className="text-sm text-text-secondary">
            Data is stored in your browser&apos;s local storage for this demo. You can reset to default data at any time.
          </p>
          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Data to Defaults
          </button>
        </motion.div>
      )}

      {/* About */}
      {activeSection === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-text-primary">About The Date Crew</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            The Date Crew Matchmaker Dashboard is a premium matchmaking operations platform built for professional matchmakers.
            It combines AI-powered compatibility analysis with elegant CRM features to streamline the matchmaking process.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-primary-50">
              <p className="text-xs text-text-secondary">Version</p>
              <p className="text-sm font-semibold text-text-primary">1.0.0 MVP</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-50">
              <p className="text-xs text-text-secondary">Tech Stack</p>
              <p className="text-sm font-semibold text-text-primary">Next.js 15 · Tailwind</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-50">
              <p className="text-xs text-text-secondary">AI Engine</p>
              <p className="text-sm font-semibold text-text-primary">GPT-4o-mini + Mock</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-50">
              <p className="text-xs text-text-secondary">Profiles</p>
              <p className="text-sm font-semibold text-text-primary">120+ Realistic</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      {activeSection === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
          <p className="text-sm text-text-secondary">
            Notification preferences will be available in a future update. Currently, all notifications are enabled by default.
          </p>
        </motion.div>
      )}
    </div>
  );
}
