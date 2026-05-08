'use client';

import { Task } from '@prisma/client';
import { CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
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

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newStatus = !task.completed;
    startTransition(async () => {
      await toggleTask(task.id, newStatus);
      if (newStatus) {
        toast.success('Task completed!', {
          description: task.title,
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#60a5fa', '#93c5fd']
        });
      } else {
        toast.info('Task marked as pending');
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      startTransition(async () => {
        await deleteTask(task.id);
        toast.error('Task deleted');
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
        onClick={() => setIsDetailOpen(true)}
        className={cn(
          "group p-5 rounded-2xl border border-border/40 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer",
          task.completed && "opacity-60 grayscale-[0.5]"
        )}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="mt-1 text-muted-foreground hover:text-primary transition-colors active:scale-90"
            disabled={isPending}
          >
            {task.completed ? (
              <CheckCircle2 className="text-primary" size={24} />
            ) : (
              <Circle size={24} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-bold truncate tracking-tight",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1 font-medium">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={cn(
                "text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg",
                priorityColors[task.priority as keyof typeof priorityColors]
              )}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-accent/30 px-2 py-1 rounded-lg">
                  <Clock size={14} />
                  <span>{mounted ? new Date(task.dueDate).toLocaleDateString() : '---'}</span>
                </div>
              )}
              
              {task.category && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-accent/30 px-2 py-1 rounded-lg">
                  <Tag size={14} />
                  <span>{task.category}</span>
                </div>
              )}

              {task.project && (
                <div className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-lg">
                  {task.project.title}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all active:scale-90"
            disabled={isPending}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDetailOpen && (
          <TaskDetail task={task} onClose={() => setIsDetailOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
