'use client';

import { useState, useEffect } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  Users, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon,
  ChevronRight,
  MoreVertical,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ItineraryPage() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState([
    { id: 1, type: 'Flight', title: 'Flight to NYC (JFK)', time: '08:30 AM', date: 'May 12', location: 'Gate B12', active: true },
    { id: 2, type: 'Interview', title: 'Senior Dev Interview', time: '02:00 PM', date: 'May 12', location: 'Zoom', active: false },
    { id: 3, type: 'Train', title: 'Amtrak to Boston', time: '10:00 AM', date: 'May 15', location: 'Penn Station', active: false },
  ]);

  useEffect(() => setMounted(true), []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Flight': return Plane;
      case 'Train': return Train;
      case 'Bus': return Bus;
      case 'Interview': return Briefcase;
      case 'Meeting': return Users;
      default: return CalendarIcon;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full pb-32 md:pb-12">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Itinerary</h1>
          <p className="text-muted-foreground font-bold">Upcoming travel, meetings, and events.</p>
        </div>
        <button className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="grid gap-6">
        {items.map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group relative bg-card border-2 border-border/40 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/30 transition-all",
                item.active && "ring-4 ring-primary/5 border-primary/20"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg",
                  item.type === 'Flight' ? "bg-blue-500" : 
                  item.type === 'Interview' ? "bg-purple-500" :
                  item.type === 'Train' ? "bg-orange-500" : "bg-primary"
                )}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{item.type}</span>
                    {item.active && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">{item.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-accent/50 px-2.5 py-1 rounded-lg">
                      <CalendarIcon size={14} /> {item.date}
                    </div>
                    <div className="flex items-center gap-1.5 bg-accent/50 px-2.5 py-1 rounded-lg">
                      <Clock size={14} /> {item.time}
                    </div>
                    <div className="flex items-center gap-1.5 bg-accent/50 px-2.5 py-1 rounded-lg">
                      <MapPin size={14} /> {item.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 md:mt-0 md:pl-8 md:border-l border-border/10">
                <button className="flex-1 md:flex-none px-6 py-3 bg-accent rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent/80 active:scale-95 transition-all">
                  Details
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
