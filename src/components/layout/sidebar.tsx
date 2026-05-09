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
  User
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const navItems = [
  { icon: CheckSquare, label: 'Tasks', href: '/' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Target, label: 'Goals', href: '/goals' },
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
    <aside className="hidden md:flex flex-col w-72 border-r-2 border-border/40 h-screen sticky top-0 bg-card/50 backdrop-blur-xl">
      <div className="p-10">
        <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent">Focus</h1>
      </div>
      
      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group",
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
              <item.icon size={22} strokeWidth={isActive ? 3 : 2} className={cn(isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
              <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t-2 border-border/40 space-y-4">
        {user && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/30 border border-border/10 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">User</p>
              <p className="text-sm font-black truncate leading-tight">{user.email?.split('@')[0]}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-accent/30 hover:bg-accent text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            {mounted && (theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />)}
            <span className="font-black text-[10px] uppercase tracking-tighter">Theme</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/5 hover:bg-destructive/10 text-destructive transition-all active:scale-95"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="font-black text-[10px] uppercase tracking-tighter">Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
