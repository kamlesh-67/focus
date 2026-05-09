'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Globe, Info, Bell, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      new Notification("Focus", { body: "Notifications enabled! We'll keep you sharp." });
      toast.success("Notifications enabled!");
    } else {
      toast.error("Permission denied");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Personalize your experience.</p>
      </header>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Zap className="text-primary" size={20} /> Appearance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'light', icon: Sun, label: 'Light', color: 'text-yellow-500' },
              { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-400' },
              { id: 'system', icon: Laptop, label: 'System', color: 'text-slate-400' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 group",
                  theme === t.id 
                    ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5 ring-2 ring-primary/20" 
                    : "border-border/30 hover:border-border hover:bg-accent/50 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  theme === t.id ? "bg-primary/20" : "bg-accent/50 group-hover:bg-accent"
                )}>
                  <t.icon size={28} className={t.color} />
                </div>
                <span className="font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bell className="text-primary" size={20} /> Notifications
          </h2>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/30 border border-border/10">
            <div className="space-y-1">
              <p className="font-bold">Desktop Reminders</p>
              <p className="text-sm text-muted-foreground font-medium">Get notified when tasks are due.</p>
            </div>
            <button
              onClick={requestNotificationPermission}
              disabled={notificationsEnabled}
              className={cn(
                "px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                notificationsEnabled 
                  ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" 
                  : "bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95"
              )}
            >
              {notificationsEnabled ? "Enabled" : "Enable"}
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-primary" size={20} /> Data & Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/30 transition-colors">
              <div>
                <p className="font-bold">Row Level Security</p>
                <p className="text-sm text-muted-foreground font-medium">Your data is isolated and encrypted.</p>
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/30 transition-colors">
              <div>
                <p className="font-bold">Export Data</p>
                <p className="text-sm text-muted-foreground font-medium">Download your workspace as JSON.</p>
              </div>
              <button onClick={() => toast.info("Exporting coming soon...")} className="px-4 py-2 border-2 border-border/60 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all">Export</button>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">About</h2>
          <div className="space-y-2">
            {[
              { icon: Info, label: 'Version', value: '1.2.0', href: null },
              { icon: Globe, label: 'Built for High-Performance', value: 'PRO', href: null },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/50 rounded-lg">
                    <item.icon size={20} className="text-muted-foreground" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                {item.href ? (
                  <a href={item.href} className="text-primary font-bold hover:underline px-4 py-2 bg-primary/10 rounded-xl">
                    {item.value}
                  </a>
                ) : (
                  <span className="text-muted-foreground font-mono bg-accent/50 px-3 py-1 rounded-lg text-sm font-black">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
