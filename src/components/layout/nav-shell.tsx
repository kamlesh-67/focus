'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/';
  const isDocsPage = pathname?.startsWith('/docs');
  const isSupportPage = pathname?.startsWith('/support');

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isAuthPage || isLandingPage || isDocsPage || isSupportPage) {
    return <main className="flex-1 min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex w-full relative">
      {/* Top Loading Bar */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-1 bg-primary z-[100]"
          />
        )}
      </AnimatePresence>

      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen pb-24 md:pb-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
