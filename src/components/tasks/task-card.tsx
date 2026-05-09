'use client';

import { Task } from '@prisma/client';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Tag, 
  Trash2, 
  Wind,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleTask, deleteTask } from '@/app/actions/tasks';
import { useTransition, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskDetail } from './task-detail';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { playSound } from '@/lib/utils/sounds';
import { ZenFocusMode } from '../ui/zen-focus-mode';

interface TaskCardProps {
  task: Task & { project?: { title: string } | null };
}

const priorityColors = {
  Low: 'text-blue-500 bg-blue-500/10',
  Medium: 'text-yellow-500 bg-yellow-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Urgent: 'text-red-500 bg-red-500/10',
};

const statusColors = {
  'Open': 'bg-slate-100 text-slate-700',
  'Analysis': 'bg-purple-100 text-purple-700',
  'Design': 'bg-pink-100 text-pink-700',
  'Development': 'bg-blue-100 text-blue-700',
  'Done': 'bg-green-100 text-green-700',
  'Hold': 'bg-orange-100 text-orange-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
};

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newStatus = !task.completed;
    playSound('pop');
    startTransition(async () => {
      const result = await toggleTask(task.id, newStatus);
      if (result.success) {
        if (newStatus) {
          playSound('success');
          toast.success('Task completed!');
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#60a5fa']
          });
        }
      } else {
        toast.error('Error', { description: result.error });
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this task?')) {
      startTransition(async () => {
        const result = await deleteTask(task.id);
        if (result.success) {
          toast.error('Task deleted');
        }
      });
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "group relative flex items-stretch gap-0 rounded-[1.5rem] border-2 border-border/40 bg-card hover:border-primary/20 transition-all",
          task.completed && "opacity-60"
        )}
      >
        {/* Interaction Side: Toggle */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="flex items-center justify-center px-5 border-r border-border/10 hover:bg-accent/30 transition-all active:scale-90"
        >
          {task.completed ? (
            <CheckCircle2 className="text-primary" size={28} strokeWidth={3} />
          ) : (
            <Circle size={28} strokeWidth={2.5} className="text-muted-foreground" />
          )}
        </button>

        {/* Content Side: Open Detail */}
        <div 
          onClick={() => setIsDetailOpen(true)}
          className="flex-1 p-5 cursor-pointer min-w-0"
        >
          <div className="flex items-center gap-2 mb-2">
            {task.category && (
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                {task.category}
              </span>
            )}
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-border/20",
              priorityColors[task.priority as keyof typeof priorityColors]
            )}>
              {task.priority}
            </span>
          </div>

          <h3 className={cn(
            "text-lg font-black truncate tracking-tighter",
            task.completed && "line-through text-muted-foreground opacity-50"
          )}>
            {task.title}
          </h3>

          <div className="flex items-center gap-3 mt-3">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Clock size={12} />
                <span>{mounted ? new Date(task.dueDate).toLocaleDateString() : '---'}</span>
              </div>
            )}
            {task.project && (
              <div className="text-[10px] font-black text-primary/60 truncate max-w-[100px]">
                • {task.project.title}
              </div>
            )}
          </div>
        </div>

        {/* Action Side: Focus & Delete */}
        <div className="flex items-center gap-1 px-4">
          {!task.completed && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsZenOpen(true); }}
              className="p-3 text-primary hover:bg-primary/10 rounded-2xl transition-all active:scale-75"
            >
              <Wind size={20} strokeWidth={2.5} />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all active:scale-75"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDetailOpen && (
          <TaskDetail task={task} onClose={() => setIsDetailOpen(false)} />
        )}
        {isZenOpen && (
          <ZenFocusMode 
            task={task} 
            onClose={() => setIsZenOpen(false)} 
            onComplete={() => { setIsZenOpen(false); handleToggle(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
