'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { ReactNode } from 'react';

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
