'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Globe, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Personalize your experience.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Appearance</h2>
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

        <section className="bg-card border border-border/30 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">About</h2>
          <div className="space-y-2">
            {[
              { icon: Info, label: 'Version', value: '1.0.0', href: null },
              { icon: Globe, label: 'Source Code', value: 'GitHub', href: '#' },
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
                  <span className="text-muted-foreground font-mono bg-accent/50 px-3 py-1 rounded-lg text-sm">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
