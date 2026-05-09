'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, HelpCircle, Rocket, Zap, ChevronRight, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const docsContent = [
  {
    category: "Getting Started",
    icon: Rocket,
    articles: [
      { title: "Introduction to Focus", slug: "intro", content: "Focus is a heavyweight minimalist productivity tool designed for high-performance individuals. It combines tasks, goals, and notes in one unified workspace." },
      { title: "Installation Guide (PWA)", slug: "install", content: "To install Focus as a PWA, click the 'Install' icon in your browser address bar. This allows you to use Focus offline and as a standalone desktop or mobile app." },
      { title: "Creating Your First Task", slug: "first-task", content: "Click the '+' button in the bottom right or on any calendar day to create a task. Add a title, priority, and optional due date." },
    ]
  },
  {
    category: "Advanced Features",
    icon: Zap,
    articles: [
      { title: "Managing Goals & Projects", slug: "goals", content: "Goals allow you to group multiple tasks. Progress is automatically calculated based on task completion within the project." },
      { title: "Using the Calendar", slug: "calendar", content: "The calendar provides a high-level view of your schedule. You can click on any date to quickly add tasks or projects for that specific day." },
      { title: "Capturing Ideas with Notes", slug: "notes", content: "Sticky notes are perfect for unstructured thoughts. They are color-coded and synced instantly across all your devices." },
    ]
  },
  {
    category: "Security & Account",
    icon: Book,
    articles: [
      { title: "Row Level Security (RLS)", slug: "rls", content: "Your data is protected by Supabase RLS. Only you can see and modify your tasks, goals, and notes." },
      { title: "Account Management", slug: "account", content: "You can manage your theme preferences and account settings in the 'Settings' tab. Sign out safely to protect your data on shared devices." },
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <CheckSquare size={18} strokeWidth={3} />
              </div>
              <span className="text-xl font-black tracking-tighter">Focus Docs</span>
            </Link>
          </div>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-border/40 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
            />
          </div>

          <Link href="/" className="text-sm font-black uppercase tracking-widest text-primary hover:underline">
            Back to App
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 flex-1 flex flex-col md:flex-row gap-12 py-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-72 space-y-10">
          {filteredDocs.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <cat.icon size={16} />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">{cat.category}</h3>
              </div>
              <ul className="space-y-1">
                {cat.articles.map((art) => (
                  <li key={art.slug}>
                    <button
                      onClick={() => setActiveArticle(art)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                        activeArticle.slug === art.slug 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {art.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Article Content */}
        <main className="flex-1 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-tight mb-4">{activeArticle.title}</h1>
            <div className="h-1.5 w-20 bg-primary rounded-full mb-8" />
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-muted-foreground font-medium mb-8">
              {activeArticle.content}
            </p>
            
            <div className="p-8 bg-accent/30 border border-border/20 rounded-[2.5rem] mt-12">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <HelpCircle size={24} />
                <h4 className="text-lg font-black uppercase tracking-wider">Pro Tip</h4>
              </div>
              <p className="font-bold text-muted-foreground leading-relaxed">
                Consistent focus sessions are the key to long-term progress. Use the goals feature to track your multi-day projects and visualize your velocity.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border/20 flex justify-between items-center">
            <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              <ChevronRight className="rotate-180" size={16} /> Previous
            </button>
            <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:underline transition-all">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
