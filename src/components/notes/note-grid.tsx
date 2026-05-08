'use client';

import { StickyNote } from '@prisma/client';
import { useState, useTransition, useEffect } from 'react';
import { createNote, deleteNote, updateNote } from '@/app/actions/notes';
import { Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const colors = [
  'bg-yellow-100 dark:bg-yellow-900/30',
  'bg-blue-100 dark:bg-blue-900/30',
  'bg-green-100 dark:bg-green-900/30',
  'bg-pink-100 dark:bg-pink-900/30',
  'bg-purple-100 dark:bg-purple-900/30',
];

export function NoteGrid({ initialNotes }: { initialNotes: StickyNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    startTransition(async () => {
      const note = await createNote(newNoteContent, color);
      setNotes([note, ...notes]);
      setNewNoteContent('');
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="bg-card border-2 border-dashed border-border/30 rounded-2xl p-4 flex flex-col min-h-[200px]">
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Type a quick note..."
          className="flex-1 bg-transparent resize-none outline-none text-sm p-2"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim() || isPending}
            className="p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 transition-opacity"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "p-6 rounded-2xl flex flex-col min-h-[200px] group relative shadow-sm hover:shadow-md transition-shadow",
              note.color || 'bg-accent'
            )}
          >
            <div className="flex-1 text-sm whitespace-pre-wrap">
              {note.content}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {mounted ? new Date(note.createdAt).toLocaleDateString() : '---'}
              </span>
              <button
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
