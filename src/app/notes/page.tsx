import { getNotes } from '@/app/actions/notes';
import { NoteGrid } from '@/components/notes/note-grid';
import { FAB } from '@/components/ui/fab';

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Sticky Notes</h1>
        <p className="text-muted-foreground">Capture your ideas instantly.</p>
      </header>

      <NoteGrid initialNotes={notes} />
      
      <FAB />
    </div>
  );
}
