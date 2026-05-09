'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Flame, 
  Wind, 
  Calendar as CalendarIcon,
  Plus,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoro } from '@/lib/contexts/pomodoro-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FocusPage() {
  const { timeLeft, isActive, mode, startTimer, pauseTimer, resetTimer, sessionCount } = usePomodoro();
  const [mounted, setMounted] = useState(false);
  const [scheduledSessions, setScheduledSessions] = useState([
    { id: 1, time: '09:00 AM', label: 'Morning Deep Work', active: true },
    { id: 2, time: '02:00 PM', label: 'Afternoon Sprint', active: false },
  ]);

  useEffect(() => setMounted(true), []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full pb-32 md:pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Deep Focus</h1>
        <p className="text-muted-foreground font-bold italic">"Concentrate all your thoughts upon the work at hand."</p>
      </header>

      {/* Main Timer Card */}
      <div className="bg-card border-4 border-primary rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden mb-12">
         {/* Background Pulse */}
         <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary animate-pulse"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <Wind size={24} strokeWidth={3} className={cn(isActive && "animate-spin-slow")} />
            <span className="text-sm font-black uppercase tracking-[0.3em]">{mode} Active</span>
          </div>

          <h2 className="text-[10rem] font-black tracking-tighter tabular-nums leading-none mb-10">
            {formatTime(timeLeft)}
          </h2>

          <div className="flex items-center justify-center gap-6">
            {!isActive ? (
              <button 
                onClick={startTimer}
                className="px-12 py-6 bg-primary text-white rounded-[2rem] text-2xl font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
              >
                Start Session
              </button>
            ) : (
              <button 
                onClick={pauseTimer}
                className="px-12 py-6 bg-accent rounded-[2rem] text-2xl font-black hover:bg-accent/80 active:scale-95 transition-all"
              >
                Pause
              </button>
            )}
            <button 
              onClick={resetTimer}
              className="p-6 bg-accent/50 text-muted-foreground rounded-[2rem] hover:bg-accent transition-all active:scale-90"
            >
              <RotateCcw size={32} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats & Scheduling */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Daily Stats */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Today's Pulse</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-card border-2 border-border/40 rounded-[2.5rem] flex flex-col items-center shadow-lg">
              <Flame size={32} className="text-orange-500 mb-2" />
              <span className="text-3xl font-black">{sessionCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sessions</span>
            </div>
            <div className="p-8 bg-card border-2 border-border/40 rounded-[2.5rem] flex flex-col items-center shadow-lg">
              <Clock size={32} className="text-blue-500 mb-2" />
              <span className="text-3xl font-black">{sessionCount * 25}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minutes</span>
            </div>
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Schedule</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Plus size={12} strokeWidth={3} /> Add New
            </button>
          </div>
          <div className="space-y-3">
            {scheduledSessions.map((session) => (
              <div key={session.id} className="p-5 bg-card border-2 border-border/40 rounded-3xl flex items-center justify-between group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm",
                    session.active ? "bg-primary text-white" : "bg-accent text-muted-foreground"
                  )}>
                    {session.time.split(' ')[0]}
                  </div>
                  <div>
                    <p className="font-black tracking-tight">{session.label}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{session.time.split(' ')[1]}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                  <SettingsIcon size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
