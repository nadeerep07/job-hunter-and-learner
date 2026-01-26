'use client';

import { Target } from '@/lib/types';
import { Trash2, CheckCircle2, Circle, Clock, Lightbulb, BarChart3 } from 'lucide-react';

interface TargetListProps {
  targets: Target[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_STYLES = {
  Career: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
  Learning: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10',
  Health: 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
};

export function TargetList({ targets, onToggle, onDelete }: TargetListProps) {
  if (targets.length === 0) return (
    <div className="text-center p-20 border-2 border-dashed rounded-3xl opacity-50">
      <p>Your timeline is empty. Add a task to begin.</p>
    </div>
  );

  const completed = targets.filter((t) => t.completed).length;
  const progress = Math.round((completed / targets.length) * 100);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-3xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            <h2 className="font-bold text-sm tracking-widest uppercase">Daily Momentum</h2>
          </div>
          <span className="text-3xl font-black text-primary">{progress}%</span>
        </div>
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden border">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {targets.map((target) => (
          <div
            key={target.id}
            className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-md ${
              target.completed ? 'bg-muted/50 border-transparent opacity-60' : CATEGORY_STYLES[target.category as keyof typeof CATEGORY_STYLES] + ' border-border shadow-sm'
            }`}
          >
            <div className="hidden sm:flex flex-col items-center justify-center min-w-[85px] border-r pr-4 border-border/50">
               <span className="text-xs font-black">{target.startTime || 'TBD'}</span>
               <div className="h-4 w-[1px] bg-border my-1" />
               <span className="text-xs font-black">{target.endTime || 'TBD'}</span>
            </div>

            <button onClick={() => onToggle(target.id)} className="mt-1 transition-transform active:scale-75">
              {target.completed ? <CheckCircle2 size={26} className="text-green-500" /> : <Circle size={26} className="text-muted-foreground group-hover:text-primary" />}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg leading-tight ${target.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {target.title}
              </h3>
              <div className="flex items-start gap-1.5 mt-2 bg-background/30 p-2 rounded-lg">
                <Lightbulb size={14} className="mt-0.5 text-amber-500 flex-shrink-0" />
                <p className="text-sm italic text-muted-foreground leading-relaxed">{target.purpose}</p>
              </div>
            </div>

            <button onClick={() => onDelete(target.id)} className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}