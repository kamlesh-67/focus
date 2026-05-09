'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, ArrowRight, Zap, Target, StickyNote, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: "Welcome to Focus!",
    description: "I'm so glad you're here. Let's take 30 seconds to show you how to master your day.",
    icon: CheckSquare,
    color: "bg-primary"
  },
  {
    title: "The Power of Tasks",
    description: "Click the '+' button in the bottom right to add a task. Give it a priority and a due date to keep it sharp.",
    icon: Zap,
    color: "bg-blue-500"
  },
  {
    title: "Think in Goals",
    description: "Group your tasks into Goals. We'll automatically track your progress as you finish tasks.",
    icon: Target,
    color: "bg-indigo-500"
  },
  {
    title: "Quick Ideas",
    description: "Got a fast idea? Toss it into Sticky Notes. They are perfect for links, reminders, or half-baked thoughts.",
    icon: StickyNote,
    color: "bg-sky-500"
  },
  {
    title: "You're All Set!",
    description: "Focus is built for clarity. Use the Calendar for the big picture and the Dashboard for daily action.",
    icon: CheckSquare,
    color: "bg-green-500"
  }
];

export function TutorialOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('focus_seen_tutorial');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const completeTutorial = () => {
    localStorage.setItem('focus_seen_tutorial', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-card border-4 border-primary rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-10 text-center">
          <div className="flex justify-center mb-8">
            <motion.div 
              key={currentStep}
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              className={cn("w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-2xl", step.color)}
            >
              <step.icon size={48} strokeWidth={3} />
            </motion.div>
          </div>

          <h2 className="text-4xl font-black tracking-tightest mb-4 leading-tight">{step.title}</h2>
          <p className="text-lg text-muted-foreground font-bold mb-10 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === currentStep ? "w-8 bg-primary" : "w-2 bg-border"
                  )} 
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"} <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <button 
          onClick={completeTutorial}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </motion.div>
    </div>
  );
}
