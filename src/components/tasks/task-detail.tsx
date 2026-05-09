'use client';

import { Task, Comment } from '@prisma/client';
import { useState, useEffect, useTransition } from 'react';
import { addComment, getComments } from '@/app/actions/comments';
import { getSubTasks, addSubTask, toggleSubTask, deleteSubTask } from '@/app/actions/subtasks';
import { 
  X, Send, MessageSquare, Clock, Tag, Flag, 
  CheckSquare, Plus, Trash2, ListChecks 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [subtasks, setSubTasks] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newSubTask, setNewSubTask] = useState('');
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const [cData, sData] = await Promise.all([
        getComments(task.id),
        getSubTasks(task.id)
      ]);
      setComments(cData);
      setSubTasks(sData);
    }
    fetchData();
  }, [task.id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    startTransition(async () => {
      const comment = await addComment(task.id, newComment);
      if (comment) {
        setComments([...comments, comment]);
        setNewComment('');
        toast.success('Comment added');
      } else {
        toast.error('Failed to add comment');
      }
    });
  };

  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return;
    startTransition(async () => {
      const result = await addSubTask(task.id, newSubTask);
      if (result.success && result.data) {
        setSubTasks([...subtasks, result.data]);
        setNewSubTask('');
      } else {
        toast.error('Failed to add sub-task');
      }
    });
  };

  const handleToggleSubTask = (id: string, completed: boolean) => {
    startTransition(async () => {
      const result = await toggleSubTask(id, !completed);
      if (result.success) {
        setSubTasks(subtasks.map(s => s.id === id ? { ...s, completed: !completed } : s));
      }
    });
  };

  const handleDeleteSubTask = (id: string) => {
    startTransition(async () => {
      const result = await deleteSubTask(id);
      if (result.success) {
        setSubTasks(subtasks.filter(s => s.id !== id));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-end p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
      />
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="relative w-full max-w-lg h-full bg-card border border-border/40 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-border/20 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tighter leading-tight mb-2">{task.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                <Flag size={12} /> {task.priority}
              </span>
              {task.dueDate && (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-accent/50 text-muted-foreground rounded-lg">
                  <Clock size={12} /> {mounted ? new Date(task.dueDate).toLocaleDateString() : '---'}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-accent/50 hover:bg-accent rounded-2xl transition-all active:scale-90 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Description */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Description</h3>
            <div className="text-base font-medium leading-relaxed bg-accent/20 p-6 rounded-3xl border border-border/10">
              {task.description || 'No description provided.'}
            </div>
          </section>

          {/* Sub-tasks Checklist */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Checklist</h3>
              </div>
              <span className="px-2.5 py-1 bg-primary/10 rounded-lg text-[10px] font-black text-primary uppercase">
                {subtasks.filter(s => s.completed).length}/{subtasks.length} Done
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {subtasks.map((sub) => (
                <div key={sub.id} className="group flex items-center gap-3 p-4 bg-accent/10 rounded-2xl border border-border/5 transition-all hover:bg-accent/20">
                  <button 
                    onClick={() => handleToggleSubTask(sub.id, sub.completed)}
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      sub.completed ? "bg-primary border-primary text-white" : "border-border hover:border-primary"
                    )}
                  >
                    {sub.completed && <CheckSquare size={14} strokeWidth={3} />}
                  </button>
                  <span className={cn(
                    "flex-1 text-sm font-bold",
                    sub.completed && "line-through text-muted-foreground opacity-60"
                  )}>
                    {sub.title}
                  </span>
                  <button 
                    onClick={() => handleDeleteSubTask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
                placeholder="Add a step..."
                className="w-full pl-6 pr-14 py-4 rounded-2xl border-2 border-dashed border-border/40 bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
              />
              <button
                onClick={handleAddSubTask}
                disabled={!newSubTask.trim() || isPending}
                className="absolute right-2 top-2 p-2.5 bg-accent hover:bg-primary hover:text-white rounded-xl transition-all disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </section>

          {/* Activity Threads */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <MessageSquare size={18} />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Activity</h3>
            </div>
            
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-card border border-border/20 p-5 rounded-[1.5rem] shadow-sm">
                  <p className="text-sm font-semibold mb-3 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
                    <Clock size={10} />
                    <span>{mounted ? new Date(comment.createdAt).toLocaleString() : '---'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Comment Input */}
        <div className="p-6 md:p-8 bg-accent/30 border-t border-border/20 backdrop-blur-md">
          <div className="relative group">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a thought..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl border border-border/20 bg-card focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold shadow-inner"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isPending}
              className="absolute right-2 top-2 p-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-all disabled:opacity-50 active:scale-90 shadow-lg shadow-primary/20 flex items-center justify-center min-w-[44px] min-h-[44px]"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
