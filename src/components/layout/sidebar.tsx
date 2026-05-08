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

      <div className="p-4 mt-auto border-t border-border/30 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/20">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-between gap-3 px-4 py-3 w-full rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
        >
          <div className="flex items-center gap-3">
            {mounted && (theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />)}
            <span className="font-semibold text-sm">Theme</span>
          </div>
        </button>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-all font-semibold text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
