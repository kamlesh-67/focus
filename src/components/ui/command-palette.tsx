'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckSquare, 
  Target, 
  StickyNote, 
  Settings, 
  Zap, 
  Calendar,
  Command as CommandIcon,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard', shortcut: 'G T' },
    { icon: Calendar, label: 'Calendar', href: '/calendar', shortcut: 'G C' },
    { icon: Target, label: 'Goals', href: '/goals', shortcut: 'G G' },
    { icon: StickyNote, label: 'Notes', href: '/notes', shortcut: 'G N' },
    { icon: Settings, label: 'Settings', href: '/settings', shortcut: 'G S' },
    { icon: Zap, label: 'New Task', action: 'newTask', shortcut: 'N' },
  ];

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleAction = (item: typeof actions[0]) => {
    if (item.href) {
      router.push(item.href);
      setIsOpen(false);
    } else if (item.action === 'newTask') {
      // Logic to trigger the FAB or Task Form could go here
      setIsOpen(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      handleAction(filteredActions[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-card border-2 border-border/40 rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-6 border-b-2 border-border/20 flex items-center gap-4">
              <Search className="text-muted-foreground" size={24} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search anything or type a command..."
                className="flex-1 bg-transparent text-2xl font-black tracking-tight outline-none placeholder:text-muted-foreground/30"
              />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/50 rounded-xl border border-border/20 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-4">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {filteredActions.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => handleAction(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 group",
                      selectedIndex === index 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "hover:bg-accent/50 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2.5 rounded-xl transition-colors",
                        selectedIndex === index ? "bg-white/20" : "bg-accent"
                      )}>
                        <item.icon size={20} strokeWidth={2.5} />
                      </div>
                      <span className="font-black text-lg tracking-tight">{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                        selectedIndex === index ? "bg-white/20 text-white" : "bg-accent text-muted-foreground"
                      )}>
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-accent/20 border-t border-border/10 flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center gap-4 ml-4">
                <span className="flex items-center gap-1"><kbd className="bg-accent px-1.5 py-0.5 rounded border border-border/40">↑</kbd> <kbd className="bg-accent px-1.5 py-0.5 rounded border border-border/40">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-accent px-1.5 py-0.5 rounded border border-border/40">Enter</kbd> to select</span>
              </div>
              <div className="flex items-center gap-2 mr-4">
                <CommandIcon size={12} />
                <span>Global Search</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
