'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { DashboardStats } from './dashboard/dashboard-stats';
import { TargetsPage } from './targets/targets-page';
import { LearningPage } from './learning/learning-page';
import { DietPage } from './diet/diet-page';
import {
  BarChart3,
  CheckSquare,
  BookOpen,
  Apple,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';

type TabType = 'dashboard' | 'targets' | 'learning' | 'diet';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'targets', label: 'Targets', icon: CheckSquare },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'diet', label: 'Diet', icon: Apple },
] as const;

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, isHydrated } = useAppState();

  if (!isHydrated || !state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your productivity dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Productivity Hub</h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back!</h2>
              <p className="text-muted-foreground">
                Here's your productivity overview for today
              </p>
            </div>
            <DashboardStats state={state} />
          </div>
        )}

        {activeTab === 'targets' && <TargetsPage />}
        {activeTab === 'learning' && <LearningPage />}
        {activeTab === 'diet' && <DietPage />}
      </main>
    </div>
  );
}
