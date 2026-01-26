'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LearningFormProps {
  onGenerate: (topic: string, category: string) => void;
  isLoading: boolean;
}

const CATEGORIES = ['Dart', 'Flutter', 'JavaScript', 'Node.js', 'MongoDB', 'AI'];

export function LearningForm({ onGenerate, isLoading }: LearningFormProps) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('JavaScript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onGenerate(topic, category);
    setTopic('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., React Hooks, Async/Await"
          className="bg-background"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground disabled:opacity-50"
          disabled={isLoading}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
        {isLoading ? 'Generating...' : 'Generate Notes with AI'}
      </Button>
    </form>
  );
}
