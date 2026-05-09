'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  StickyNote, 
  Settings, 
  Sun, 
  Moon,
  LogOut,
  User,
  BookOpen,
  Plane,
  Wind
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const navItems = [
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Wind, label: 'Focus', href: '/focus' },
  { icon: Plane, label: 'Itinerary', href: '/itinerary' },
  { icon: StickyNote, label: 'Notes', href: '/notes' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-72 border-r-2 border-border/40 h-screen sticky top-0 bg-card overflow-hidden">
      {/* Fixed Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent leading-none">Focus</h1>
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-[8px] font-black uppercase tracking-widest border border-primary/20">V1.0.0</span>
          </div>
          <Link 
            href="/docs" 
            title="Documentation"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <BookOpen size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
      
      {/* Navigation Area */}
      <nav className="flex-1 px-6 space-y-1 overflow-hidden py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3 rounded-[1.25rem] transition-all duration-300 group",
                isActive 
                  ? "text-primary-foreground shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)]" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground active:scale-95"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveBg"
                  className="absolute inset-0 bg-primary rounded-[1.25rem] -z-10"
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                />
              )}
              <item.icon size={18} strokeWidth={isActive ? 3 : 2} className={cn(isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area - Compact */}
      <div className="p-6 pt-2 border-t-2 border-border/40 space-y-4">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-accent/30 border border-border/10">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate leading-tight">{user.email?.split('@')[0]}</p>
            </div>
            <div className="flex items-center gap-1">
              {/* Theme Toggle Button - Small Icon Only */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle Theme"
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all active:scale-90"
              >
                {mounted && (theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-blue-600" />)}
              </button>

              {/* Sign Out Button - Small Icon Only */}
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all active:scale-90"
              >
                <LogOut size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center">
           <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Precision Productivity</p>
        </div>
      </div>
    </aside>
  );
}
