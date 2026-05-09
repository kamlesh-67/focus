'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, HelpCircle, Rocket, Zap, ChevronRight, CheckSquare, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const docsContent = [
  {
    category: "Getting Started",
    icon: Rocket,
    articles: [
      { title: "Introduction to Focus", slug: "intro", content: "Focus is a professional-grade minimalist productivity tool. It combines tasks, goals, and notes in one unified workspace, designed for high-performance individuals who demand clarity." },
      { title: "Installation Guide (PWA)", slug: "install", content: "Focus is a Progressive Web App. To install, click the 'Install' icon in your browser's address bar. This enables offline access and a native desktop/mobile experience." },
      { title: "Creating Your First Task", slug: "first-task", content: "Use the global '+' button or the Command Palette (Ctrl+K) to create tasks. Use smart parsing (e.g., '#work !high tomorrow') for rapid entry." },
    ]
  },
  {
    category: "Mastering Productivity",
    icon: Zap,
    articles: [
      { title: "Zen Focus Mode", slug: "zen", content: "Enter an immersive, distraction-free environment for deep work. Zen mode features a breathing-guided timer and a focused task view." },
      { title: "The Command Palette", slug: "command-palette", content: "Press Ctrl+K (or Cmd+K) to open the Command Palette. Search everything and navigate the app instantly without leaving your keyboard." },
      { title: "Goal Tracking", slug: "goals", content: "Break down long-term visions into actionable goals. Focus automatically calculates progress based on linked task completion." },
    ]
  },
  {
    category: "Technical & Security",
    icon: Book,
    articles: [
      { title: "Supabase & Data Security", slug: "security", content: "Your data is secured by Supabase with Row Level Security (RLS). Every operation is authenticated and isolated to your specific user ID." },
      { title: "Native Notifications", slug: "notifications", content: "Enable desktop notifications in Settings to receive real-time alerts for upcoming deadlines and session completions." },
    ]
  }
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(docsContent[0].articles[0]);

  const filteredDocs = docsContent.map(cat => ({
    ...cat,
    articles: cat.articles.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background mesh-gradient">
      {/* Professional Header */}
      <header className="border-b-2 border-border/40 bg-card/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-3 bg-accent/50 hover:bg-accent rounded-2xl transition-all active:scale-90">
              <ArrowLeft size={20} strokeWidth={3} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <CheckSquare size={24} strokeWidth={3} />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter block leading-none">Focus Docs</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Version 1.0.0</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-full max-w-lg hidden md:block">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text"
              placeholder="Search features, shortcuts, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-border/40 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold shadow-sm"
            />
          </div>

          <Link href="/dashboard" className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            Open App
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 flex-1 flex flex-col md:flex-row gap-16 py-16">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-80 space-y-12">
          {filteredDocs.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center gap-3 mb-6 text-muted-foreground">
                <div className="p-2 bg-accent/50 rounded-lg">
                  <cat.icon size={16} strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">{cat.category}</h3>
              </div>
              <ul className="space-y-2">
                {cat.articles.map((art) => (
                  <li key={art.slug}>
                    <button
                      onClick={() => setActiveArticle(art)}
                      className={cn(
                        "w-full text-left px-5 py-4 rounded-2xl text-sm font-black tracking-tight transition-all group",
                        activeArticle.slug === art.slug 
                          ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]" 
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{art.title}</span>
                        {activeArticle.slug === art.slug && <ChevronRight size={16} strokeWidth={3} />}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 max-w-3xl">
          <motion.div
            key={activeArticle.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10">
              <h1 className="text-6xl font-black tracking-tightest mb-6 leading-[1.1]">{activeArticle.title}</h1>
              <div className="h-2 w-24 bg-primary rounded-full" />
            </div>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-2xl leading-relaxed text-muted-foreground font-bold mb-12">
                {activeArticle.content}
              </p>
              
              <div className="p-10 bg-card/60 border-2 border-border/40 rounded-[3rem] shadow-2xl relative overflow-hidden card-shine">
                <div className="flex items-center gap-4 mb-6 text-primary">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Rocket size={24} strokeWidth={3} />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-widest">Master Workflow</h4>
                </div>
                <p className="text-lg font-bold text-muted-foreground leading-relaxed">
                  Focus is designed for speed. Combine the **Command Palette** with **Zen Mode** to enter a peak state of productivity. Your data is synced automatically, so you can pick up exactly where you left off on any device.
                </p>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t-2 border-border/20 flex justify-between items-center">
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all active:scale-95">
                <ArrowLeft size={16} strokeWidth={3} /> Previous Guide
              </button>
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-6 py-3 rounded-xl transition-all active:scale-95">
                Next Guide <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
