import { getNotes } from '@/app/actions/notes';
import { NoteGrid } from '@/components/notes/note-grid';
import { FAB } from '@/components/ui/fab';
import { StickyNote } from 'lucide-react';

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Sticky Notes</h1>
        <p className="text-muted-foreground font-medium italic">"Don't let a good idea escape."</p>
      </header>

      {notes.length > 0 ? (
        <NoteGrid initialNotes={notes} />
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] bg-accent/5 flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-500 mb-2">
            <StickyNote size={40} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Your mind is a canvas</h3>
          <p className="text-muted-foreground font-bold max-w-[280px]">
            Capture quick thoughts, links, or reminders. Click the + button to create your first note.
          </p>
        </div>
      )}
      
      <FAB />
    </div>
  );
}
