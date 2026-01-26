'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TargetFormProps {
  onAddTarget: (title: string, category: 'Career' | 'Learning' | 'Health', startTime?: string, endTime?: string, purpose?: string) => void;
}

export function TargetForm({ onAddTarget }: TargetFormProps) {
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<'Career' | 'Learning' | 'Health'>('Career');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTarget(title, category, startTime || undefined, endTime || undefined, purpose);
    setTitle('');
    setPurpose('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-3xl border shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase ml-1">Task Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Flutter Bloc Refactoring" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase ml-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full h-10 px-3 bg-background border rounded-md text-sm">
            <option>Career</option>
            <option>Learning</option>
            <option>Health</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase ml-1">Target Purpose</label>
        <Textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is the goal of this task?" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase ml-1">Start</label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase ml-1">End</label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl font-bold">Save Target</Button>
    </form>
  );
}