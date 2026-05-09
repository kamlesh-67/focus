'use client';

import { useTheme } from 'next-themes';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Globe, 
  Info, 
  Bell, 
  Shield, 
  Zap, 
  BookOpen,
  Download,
  LogOut
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      toast.info("Already installed or not supported.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full pb-32 md:pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* App Experience */}
        <section className="bg-card border-2 border-border/40 rounded-[2.5rem] p-8 shadow-xl">
          <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-6">Experience</h2>
          <div className="grid gap-4">
             <button
              onClick={() => router.push('/docs')}
              className="flex items-center justify-between p-5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen size={20} strokeWidth={3} />
                </div>
                <span className="font-black">View Documentation</span>
              </div>
              <Zap size={18} />
            </button>

            <button
              onClick={handleInstall}
              className="flex items-center justify-between p-5 rounded-2xl border-2 border-border/20 hover:bg-accent transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/50 rounded-lg">
                  <Download size={20} />
                </div>
                <span className="font-black">Install Focus (PWA)</span>
              </div>
              {deferredPrompt && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-card border-2 border-border/40 rounded-[2.5rem] p-8 shadow-xl">
          <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-6">Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Light', color: 'text-yellow-500' },
              { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-400' },
              { id: 'system', icon: Laptop, label: 'System', color: 'text-slate-400' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                  theme === t.id 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border/20 hover:bg-accent text-muted-foreground"
                )}
              >
                <t.icon size={24} strokeWidth={3} className={t.color} />
                <span className="text-[10px] font-black uppercase">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Accountability */}
        <section className="bg-card border-2 border-border/40 rounded-[2.5rem] p-8 shadow-xl">
           <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-6">Accountability</h2>
           <button
              onClick={() => Notification.requestPermission()}
              className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-border/20 hover:bg-accent transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/50 rounded-lg">
                  <Bell size={20} />
                </div>
                <span className="font-black">Daily Morning Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase text-muted-foreground">09:00 AM</span>
                 <div className="w-10 h-6 bg-accent rounded-full p-1">
                   <div className="w-4 h-4 bg-muted-foreground rounded-full" />
                 </div>
              </div>
            </button>
        </section>

        {/* Danger Zone */}
        <button
          onClick={handleSignOut}
          className="w-full p-5 flex items-center justify-center gap-3 rounded-2xl bg-destructive/5 text-destructive border-2 border-destructive/10 font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all active:scale-95"
        >
          <LogOut size={20} strokeWidth={3} /> Sign Out
        </button>

        <div className="text-center pt-8">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Focus Mastery Engine • Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
