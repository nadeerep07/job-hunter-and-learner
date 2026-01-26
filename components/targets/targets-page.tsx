'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { TargetForm } from './target-form';
import { TargetList } from './target-list';
import { Button } from '@/components/ui/button';
import { Plus, X, LayoutDashboard } from 'lucide-react';

export function TargetsPage() {
  const { isHydrated, addTarget, toggleTarget, deleteTarget, getTodayTargets } = useAppState();
  const [showForm, setShowForm] = useState(false);

  if (!isHydrated) return <div className="p-8 text-center text-muted-foreground animate-pulse">Syncing your routine...</div>;

  const todayTargets = getTodayTargets();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-end justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={24} className="text-primary" />
            <h1 className="text-3xl font-black tracking-tight uppercase">Focus Mode</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Daily Roadmap: Flutter Developer & Job Hunter</p>
        </div>
        
        <Button 
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(!showForm)}
          className="rounded-full shadow-lg transition-all active:scale-95"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span className="ml-2 hidden sm:inline">{showForm ? 'Cancel' : 'Add Custom Task'}</span>
        </Button>
      </div>

      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <TargetForm onAddTarget={(...args) => {
            addTarget(...args);
            setShowForm(false);
          }} />
        </div>
      )}

      <TargetList
        targets={todayTargets}
        onToggle={toggleTarget}
        onDelete={deleteTarget}
      />
    </div>
  );
}