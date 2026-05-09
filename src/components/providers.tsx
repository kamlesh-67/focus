'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';
import { PomodoroProvider } from '@/lib/contexts/pomodoro-context';
import { CommandPalette } from '@/components/ui/command-palette';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PomodoroProvider>
        {children}
        <CommandPalette />
        <Toaster position="bottom-right" richColors closeButton />
      </PomodoroProvider>
    </ThemeProvider>
  );
}
