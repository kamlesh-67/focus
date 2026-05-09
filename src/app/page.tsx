import Link from 'next/link';
import { CheckSquare, ArrowRight, Shield, Zap, Smartphone, Layout, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b-2 border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <CheckSquare size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-center">Focus</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-accent transition-all"
            >
              Log In
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <Zap size={14} /> Productivity Redefined
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-8">
            Focus on what <br />
            <span className="text-primary italic">actually</span> matters.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-bold max-w-2xl mx-auto mb-12 leading-relaxed">
            The heavyweight minimalist workspace for your tasks, goals, and ideas. 
            Built for those who demand clarity and performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/login" 
              className="group flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              Start Free Today <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/docs" 
              className="px-10 py-5 border-2 border-border/60 rounded-[2rem] font-black text-xl hover:bg-accent transition-all"
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { 
                icon: Layout, 
                title: "Unified Workspace", 
                desc: "Tasks, goals, and notes synced in one cohesive, high-performance interface.",
                color: "text-blue-500 bg-blue-500/10"
              },
              { 
                icon: Shield, 
                title: "Secure by Design", 
                desc: "Your data is protected by Supabase RLS and multi-tenant isolation.",
                color: "text-indigo-500 bg-indigo-500/10"
              },
              { 
                icon: Smartphone, 
                title: "PWA Native", 
                desc: "Install on any device. Works offline and feels like a native application.",
                color: "text-sky-500 bg-sky-500/10"
              }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-card border-2 border-border/40 rounded-[3rem] shadow-xl hover:shadow-primary/5 transition-all flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${f.color}`}>
                  <f.icon size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="text-muted-foreground font-bold leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-center">Simple Pricing</h2>
          <p className="text-muted-foreground font-bold text-center">Free for personal use. Upgrade for teamwork.</p>
        </div>
        
        <div className="max-w-lg mx-auto">
          <div className="p-12 bg-card border-4 border-primary rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">
              Most Popular
            </div>
            <h3 className="text-3xl font-black mb-2 text-center">Pro Plan</h3>
            <div className="flex items-baseline justify-center gap-1 mb-8 text-center">
              <span className="text-5xl font-black">$0</span>
              <span className="text-muted-foreground font-bold text-center">/month</span>
            </div>
            <ul className="space-y-4 mb-10 mx-auto max-w-[200px]">
              {["Unlimited Tasks", "Advanced Projects", "Cloud Sync", "PWA Support", "Community Support"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold text-left">
                  <Zap size={18} className="text-primary flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link 
              href="/login" 
              className="block w-full py-5 bg-primary text-primary-foreground text-center rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t-2 border-border/40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <CheckSquare size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tighter text-center">Focus</span>
          </div>
          
          <div className="flex flex-wrap gap-10 text-xs font-black uppercase tracking-widest text-muted-foreground justify-center">
            <Link href="/docs" className="hover:text-primary">Documentation</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="/support" className="hover:text-primary text-center">Support</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 border border-border/60 rounded-lg text-muted-foreground hover:text-primary cursor-pointer">
              <Globe size={20} />
            </div>
            <div className="p-2 border border-border/60 rounded-lg text-muted-foreground hover:text-primary cursor-pointer">
              <Globe size={20} />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
          © 2026 Focus Mastery Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
