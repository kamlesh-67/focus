'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Send, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tightest mb-4">How can we help?</h1>
        <p className="text-xl text-muted-foreground font-bold">Our team is ready to support your focus journey.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Mail, title: "Email Support", desc: "Response within 24h", action: "support@focus.app" },
          { icon: MessageCircle, title: "Live Chat", desc: "Available 9am - 5pm EST", action: "Start Chat" },
          { icon: ShieldCheck, title: "Status Page", desc: "All systems operational", action: "View Status" },
        ].map((item, i) => (
          <div key={i} className="p-8 bg-card border-2 border-border/40 rounded-[2.5rem] text-center shadow-xl">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
              <item.icon size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">{item.title}</h3>
            <p className="text-muted-foreground font-bold mb-6">{item.desc}</p>
            <button className="text-primary font-black hover:underline">{item.action}</button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border-2 border-border/40 rounded-[3rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-black mb-8">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Name</label>
                <input required className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Email</label>
                <input required type="email" className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 outline-none font-bold" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Subject</label>
              <select className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 outline-none font-bold appearance-none">
                <option>General Inquiry</option>
                <option>Technical Issue</option>
                <option>Billing Question</option>
                <option>Feature Request</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Message</label>
              <textarea required rows={5} className="w-full px-5 py-4 rounded-2xl border border-border/20 bg-background focus:ring-4 focus:ring-primary/10 outline-none font-bold resize-none" placeholder="Describe your issue or feedback..." />
            </div>
            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
