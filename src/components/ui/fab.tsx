'use client';

import { Plus, CheckSquare, Target, StickyNote as NoteIcon, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskForm } from '@/components/tasks/task-form';
import { ProjectForm } from '@/components/projects/project-form';
import { cn } from '@/lib/utils';

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'task' | 'project' | 'note' | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: CheckSquare, label: 'Task', type: 'task', color: 'bg-blue-500 shadow-blue-500/20' },
    { icon: Target, label: 'Goal', type: 'project', color: 'bg-indigo-500 shadow-indigo-500/20' },
    { icon: NoteIcon, label: 'Note', type: 'note', color: 'bg-sky-500 shadow-sky-500/20' },
  ];

  const handleOpenForm = (type: 'task' | 'project' | 'note') => {
    setActiveForm(type);
    setIsOpen(false);
  };

  return (
    <>
      {/* Dimmer Overlay for Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-[4px] z-40"
          />
        )}
      </AnimatePresence>

      {/* FAB Container - Right Aligned for all screens */}
      <div className="fixed bottom-24 md:bottom-10 right-6 md:right-10 flex flex-col items-end gap-5 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex flex-col gap-3 mb-2"
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOpenForm(item.type as any)}
                  className="flex items-center gap-4 pl-6 pr-3 py-3 bg-card border border-border/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all group active:scale-95"
                >
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground tracking-wide whitespace-nowrap">
                    {item.label}
                  </span>
                  <div className={cn("p-3 rounded-xl text-white shadow-lg transition-transform group-hover:scale-110", item.color)}>
                    <item.icon size={20} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className={cn(
            "flex items-center justify-center bg-primary text-primary-foreground w-16 h-16 rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:rounded-[2rem]",
            isOpen && "bg-destructive text-destructive-foreground shadow-destructive/20 hover:shadow-destructive/40"
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <Plus size={32} />
          </motion.div>
        </motion.button>
      </div>

      {/* Forms Modals */}
      <AnimatePresence>
        {activeForm && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveForm(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-card border border-border/30 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      {activeForm === 'task' && <CheckSquare className="text-primary" size={24} />}
                      {activeForm === 'project' && <Target className="text-primary" size={24} />}
                      {activeForm === 'note' && <NoteIcon className="text-primary" size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {activeForm === 'task' ? 'New Task' : activeForm === 'project' ? 'New Goal' : 'New Note'}
                      </h2>
                      <p className="text-sm text-muted-foreground">Fill in the details below</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveForm(null)}
                    className="p-3 bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground rounded-2xl transition-all active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {activeForm === 'task' && <TaskForm onSuccess={() => setActiveForm(null)} />}
                {activeForm === 'project' && <ProjectForm onSuccess={() => setActiveForm(null)} />}
                {activeForm === 'note' && (
                  <div className="space-y-6">
                    <textarea
                      autoFocus
                      className="w-full px-6 py-4 rounded-2xl border border-border/30 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-lg min-h-[200px]"
                      placeholder="Capture your thought..."
                      id="fab-note-content"
                    />
                    <button
                      onClick={async () => {
                        const content = (document.getElementById('fab-note-content') as HTMLTextAreaElement).value;
                        if (content.trim()) {
                          const { createNote } = await import('@/app/actions/notes');
                          await createNote(content);
                          setActiveForm(null);
                        }
                      }}
                      className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
                    >
                      Save Note
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
