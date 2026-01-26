'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { LearningForm } from './learning-form';
import { LearningNotesDisplay } from './learning-notes-display';

const CATEGORIES = ['Dart', 'Flutter', 'JavaScript', 'Node.js', 'MongoDB', 'AI', 'All'];

export function LearningPage() {
  const { state, isHydrated, addLearningNote, deleteLearningNote, getLearningNotesByCategory } =
    useAppState();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isHydrated) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleGenerateNotes = async (topic: string, category: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate notes');
      }

      const data = await response.json();
      const notesText = data.notes;

      // Parse the response
      const definitionMatch = notesText.match(/Definition\s*([\s\S]*?)(?=Purpose|$)/i);
      const purposeMatch = notesText.match(/Purpose[\s\S]*?(?:Why it matters)?\s*([\s\S]*?)(?=Simple Example|$)/i);
      const exampleMatch = notesText.match(/Simple Example\s*([\s\S]*?)(?=Notes|$)/i);

      const definition = definitionMatch ? definitionMatch[1].trim() : '';
      const purpose = purposeMatch ? purposeMatch[1].trim() : '';
      const example = exampleMatch ? exampleMatch[1].trim() : '';

      addLearningNote(topic, category, definition, purpose, example);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate notes');
      console.error('Error generating notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes =
    selectedCategory === 'All'
      ? state?.learningNotes || []
      : getLearningNotesByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Notes</h1>
        <p className="text-muted-foreground">Generate AI-powered notes on topics you want to learn</p>
      </div>

      <LearningForm onGenerate={handleGenerateNotes} isLoading={isLoading} />

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <LearningNotesDisplay
        notes={filteredNotes}
        onDelete={deleteLearningNote}
      />
    </div>
  );
}
