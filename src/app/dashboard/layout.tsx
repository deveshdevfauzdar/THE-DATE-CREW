'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Heart, Settings, Sparkles,
  LogOut, Bell, Search, ChevronRight, Menu, X
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import * as store from '@/lib/store';
import type { Customer, Activity } from '@/types';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/matches', label: 'Matches', icon: Heart },
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Sparkles },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    // Load recent activities for notifications
    setActivities(store.getRecentActivities(5));
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close notifications and profile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (notificationsOpen || profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, profileOpen]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const { customers } = store.getFilteredCustomers({ search: searchQuery, pageSize: 5 });
      setSearchResults(customers);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-text-secondary text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-surface border-r border-border fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary leading-tight">The Date Crew</h1>
              <p className="text-[11px] text-text-tertiary">Matchmaker Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-primary-50 hover:text-primary'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-tertiary truncate">{user?.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.replace('/login'); }}
              className="p-2 rounded-lg hover:bg-danger-light text-text-tertiary hover:text-danger transition-colors"
              aria-label="Logout"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[260px] bg-surface border-r border-border z-50 lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-lg font-bold text-text-primary">The Date Crew</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-primary-50">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-primary-50 hover:text-primary'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => { logout(); router.replace('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-text-secondary" />
              </button>

              {/* Breadcrumb - Desktop */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-text-tertiary">Dashboard</span>
                {pathname !== '/dashboard' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-primary font-medium capitalize">
                      {pathname.split('/').pop()?.replace(/-/g, ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search (Desktop) */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50/50 hover:bg-primary-50 border border-border text-sm text-text-tertiary w-64 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Quick search...</span>
                <kbd className="ml-auto text-[10px] bg-surface rounded px-1.5 py-0.5 border border-border font-mono text-text-secondary">⌘K</kbd>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-xl hover:bg-primary-50 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-text-secondary" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-surface rounded-2xl shadow-xl border border-border z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border flex justify-between items-center">
                        <h3 className="font-semibold text-text-primary text-sm">Notifications</h3>
                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {activities.length > 0 ? (
                          activities.map(activity => (
                            <div key={activity.id} className="p-4 border-b border-border/50 hover:bg-primary-50/30 transition-colors cursor-pointer">
                              <p className="text-sm text-text-primary font-medium capitalize">{activity.actionType.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-text-secondary mt-0.5">{activity.description}</p>
                              <p className="text-[10px] text-text-tertiary mt-2">{formatRelativeTime(activity.createdAt)}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-text-tertiary text-sm">
                            No new notifications
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-border text-center">
                        <Link href="/dashboard" className="text-xs text-primary font-medium hover:underline">
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar (Desktop) */}
              <div className="hidden lg:flex relative pl-3 border-l border-border ml-1" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:bg-primary-50 p-1.5 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-semibold text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-text-primary">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-2xl shadow-xl border border-border z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-text-primary text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                        <span className="mt-2 inline-block text-[10px] bg-primary-50 text-primary px-2 py-0.5 rounded-full font-medium">
                          {user?.role}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 w-full p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-primary-50 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <button
                          onClick={() => { logout(); router.replace('/login'); }}
                          className="flex items-center gap-3 w-full p-2 text-sm text-danger hover:bg-danger-light rounded-xl transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Quick Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="w-5 h-5 text-text-tertiary" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers, matches, or settings..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-text-primary placeholder:text-text-tertiary text-base"
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1 rounded-lg hover:bg-primary-50 text-text-tertiary">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 bg-background">
                  {searchQuery.length > 0 ? (
                    <div>
                      {searchResults.length > 0 ? (
                        <div className="space-y-1">
                          {searchResults.map(customer => (
                            <Link
                              key={customer.id}
                              href={`/dashboard/customers/${customer.id}`}
                              onClick={() => setSearchOpen(false)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-sm text-text-primary transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs">
                                {customer.firstName[0]}{customer.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                                <p className="text-xs text-text-tertiary">{customer.designation} at {customer.currentCompany}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-text-secondary">No customers found for &quot;{searchQuery}&quot;</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-8 h-8 text-text-tertiary/50 mx-auto mb-3" />
                      <p className="text-sm text-text-secondary">Type to search for customers...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-30 safe-area-pb">
          <div className="flex items-center justify-around h-16 px-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[60px]',
                    active ? 'text-primary' : 'text-text-tertiary'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom spacer for mobile nav */}
        <div className="lg:hidden h-16" />
      </div>
    </div>
  );
}
