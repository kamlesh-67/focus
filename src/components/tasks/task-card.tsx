'use client';

import { Task } from '@prisma/client';
import { CheckCircle2, Circle, Clock, Tag, Trash2, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleTask, deleteTask } from '@/app/actions/tasks';
import { useTransition, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskDetail } from './task-detail';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task & { project?: { title: string } | null };
}

const priorityColors = {
  Low: 'text-blue-500 bg-blue-500/10',
  Medium: 'text-yellow-500 bg-yellow-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Urgent: 'text-red-500 bg-red-500/10',
};

import { playSound } from '@/lib/utils/sounds';
import { ZenFocusMode } from '../ui/zen-focus-mode';

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
          toast.success('Task completed!', {
            description: task.title,
          });
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#60a5fa', '#93c5fd']
          });
        } else {
          toast.info('Task marked as pending');
        }
      } else {
        playSound('error');
        toast.error('Error', { description: result.error });
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    if (confirm('Are you sure you want to delete this task?')) {
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
        transition={{ duration: 0.2 }}
        onClick={() => {
          playSound('click');
          setIsDetailOpen(true);
        }}
        className={cn(
          "group p-5 rounded-[2rem] border-2 border-border/40 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer card-shine",
          task.completed && "opacity-60 grayscale-[0.5]"
        )}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="mt-1 text-muted-foreground hover:text-primary transition-all active:scale-75"
            disabled={isPending}
          >
            {task.completed ? (
              <CheckCircle2 className="text-primary" size={28} strokeWidth={3} />
            ) : (
              <Circle size={28} strokeWidth={2.5} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-xl font-black truncate tracking-tighter",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1 font-bold">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl",
                priorityColors[task.priority as keyof typeof priorityColors]
              )}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-xl border border-border/10">
                  <Clock size={14} />
                  <span>{mounted ? new Date(task.dueDate).toLocaleDateString() : '---'}</span>
                </div>
              )}

              {!task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZenOpen(true);
                  }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-90"
                >
                  <Wind size={14} /> Focus
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all active:scale-75"
            disabled={isPending}
          >
            <Trash2 size={22} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDetailOpen && (
          <TaskDetail task={task} onClose={() => setIsDetailOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isZenOpen && (
          <ZenFocusMode 
            task={task} 
            onClose={() => setIsZenOpen(false)} 
            onComplete={() => {
              setIsZenOpen(false);
              handleToggle();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
