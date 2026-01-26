'use client';

import { LearningNote } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface LearningNotesDisplayProps {
  notes: LearningNote[];
  onDelete: (id: string) => void;
  onCategorize?: (category: string) => LearningNote[];
}

export function LearningNotesDisplay({ notes, onDelete }: LearningNotesDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (notes.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No notes yet. Generate one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="p-5 bg-card rounded-lg border border-border space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{note.topic}</h3>
              <span className="inline-block px-2 py-1 text-xs rounded mt-2 bg-accent/20 text-accent">
                {note.category}
              </span>
            </div>
            <button
              onClick={() => onDelete(note.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="space-y-4 text-sm text-foreground">
            {note.definition && (
              <div>
                <h4 className="font-semibold text-accent mb-1">Definition</h4>
                <p className="text-muted-foreground">{note.definition}</p>
              </div>
            )}

            {note.purpose && (
              <div>
                <h4 className="font-semibold text-accent mb-1">Purpose / Why it matters</h4>
                <p className="text-muted-foreground">{note.purpose}</p>
              </div>
            )}

            {note.example && (
              <div>
                <h4 className="font-semibold text-accent mb-1">Simple Example</h4>
                <pre className="bg-background p-3 rounded border border-border text-xs overflow-x-auto whitespace-pre-wrap break-words">
                  {note.example}
                </pre>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                note.id,
                `${note.topic}\n\nDefinition\n${note.definition}\n\nPurpose\n${note.purpose}\n\nExample\n${note.example}`
              )
            }
            className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
          >
            {copiedId === note.id ? <Check size={14} /> : <Copy size={14} />}
            {copiedId === note.id ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ))}
    </div>
  );
}
