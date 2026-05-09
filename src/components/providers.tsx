'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { PomodoroProvider } from '@/lib/contexts/pomodoro-context';
import { CommandPalette } from '@/components/ui/command-palette';
import { Download } from 'lucide-react';

export function Providers({ children }: { children: ReactNode }) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      toast("Install Focus", {
        description: "Install the app for a native experience.",
        action: {
          label: "Install",
          onClick: () => {
            e.prompt();
            e.userChoice.then((choice: any) => {
              if (choice.outcome === 'accepted') {
                setInstallPrompt(null);
              }
            });
          }
        },
        duration: 10000,
        icon: <Download className="text-primary" size={20} />
      });
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PomodoroProvider>
        {children}
        <CommandPalette />
        <Toaster 
          position="top-center" // Mobile optimized position
          richColors 
          closeButton 
          expand={false}
          style={{ zIndex: 1000 }}
        />
      </PomodoroProvider>
    </ThemeProvider>
  );
}
