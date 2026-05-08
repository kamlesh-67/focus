'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  StickyNote, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: CheckSquare, label: 'Tasks', href: '/' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: StickyNote, label: 'Notes', href: '/notes' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/30 bg-card/80 backdrop-blur-lg flex justify-around items-center p-2 pb-safe z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
