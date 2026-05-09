'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wind, 
  CheckCircle2, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Flame,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/utils/sounds';

interface ZenFocusModeProps {
  task: any;
  onClose: () => void;
  onComplete: () => void;
}

export function ZenFocusMode({ task, onClose, onComplete }: ZenFocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-background flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 animate-pulse pointer-events-none" />
      
      {/* Controls */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Wind size={20} className="animate-spin-slow" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Zen Protocol Active</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleFullscreen}
            className="p-4 bg-accent/30 hover:bg-accent rounded-full transition-all active:scale-90"
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
          <button 
            onClick={onClose}
            className="p-4 bg-accent/30 hover:bg-accent rounded-full transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl w-full space-y-12 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-4">{task.title}</h1>
          <p className="text-xl text-muted-foreground font-bold italic opacity-60">
            {task.description || "Deep focus on the present moment."}
          </p>
        </motion.div>

        {/* The Breathing Timer */}
        <div className="relative flex items-center justify-center py-20">
          <motion.div
            animate={{ 
              scale: isActive ? [1, 1.2, 1] : 1,
              opacity: isActive ? [0.1, 0.3, 0.1] : 0.1
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "easeInOut" 
            }}
            className="absolute w-[400px] h-[400px] bg-primary rounded-full blur-[100px]"
          />
          <span className="text-[12rem] font-black tracking-tighter tabular-nums leading-none">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-8">
          {!isActive ? (
            <button
              onClick={() => {
                setIsActive(true);
                playSound('pop');
              }}
              className="px-12 py-6 bg-primary text-primary-foreground rounded-[3rem] text-2xl font-black shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Start Deep Work
            </button>
          ) : (
            <div className="flex gap-6">
               <button
                onClick={() => setIsActive(false)}
                className="px-10 py-5 bg-accent rounded-[2rem] text-xl font-black hover:bg-accent/80 active:scale-95 transition-all"
              >
                Pause
              </button>
              <button
                onClick={() => {
                  playSound('success');
                  onComplete();
                }}
                className="flex items-center gap-3 px-10 py-5 bg-green-500 text-white rounded-[2rem] text-xl font-black shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                <CheckCircle2 size={24} strokeWidth={3} /> Mark Complete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Footnote */}
      <div className="absolute bottom-12 flex items-center gap-10 opacity-30 font-black uppercase tracking-[0.2em] text-xs">
         <div className="flex items-center gap-2"><Clock size={16} /> Est. 25m Session</div>
         <div className="flex items-center gap-2"><Flame size={16} /> Peak Performance</div>
      </div>
    </motion.div>
  );
}
