'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PomodoroContextType {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  mode: 'focus' | 'break';
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
  }, [isBreak]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Focus ended
        setSessionCount((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        toast.success("Focus Session Complete!", {
          description: "Time for a 5-minute break. Great work!"
        });
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#60a5fa']
        });
      } else {
        // Break ended
        setIsBreak(false);
        setTimeLeft(FOCUS_TIME);
        toast.info("Break ended", {
          description: "Ready to focus again?"
        });
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  return (
    <PomodoroContext.Provider value={{
      timeLeft,
      isActive,
      isBreak,
      sessionCount,
      startTimer,
      pauseTimer,
      resetTimer,
      mode: isBreak ? 'break' : 'focus'
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error('usePomodoro must be used within a PomodoroProvider');
  return context;
};
