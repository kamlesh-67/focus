'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  StickyNote, 
  Settings,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: StickyNote, label: 'Notes', href: '/notes' },
  { icon: BookOpen, label: 'Docs', href: '/docs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-border/40 bg-card/90 backdrop-blur-xl flex justify-around items-center p-3 pb-safe-offset-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300",
              isActive 
                ? "text-primary scale-110" 
                : "text-muted-foreground hover:text-foreground active:scale-90"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              />
            )}
            <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
