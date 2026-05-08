'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  StickyNote, 
  Settings, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: CheckSquare, label: 'Tasks', href: '/' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: StickyNote, label: 'Notes', href: '/notes' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/30 h-screen sticky top-0 bg-card/50 backdrop-blur-xl">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-primary to-blue-400 bg-clip-text text-transparent">Focus</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
              <span className="font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/30">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-between gap-3 px-4 py-3 w-full rounded-xl bg-accent/30 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          <span className="font-semibold text-sm">Appearance</span>
          {mounted && (theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />)}
        </button>
      </div>
    </aside>
  );
}
