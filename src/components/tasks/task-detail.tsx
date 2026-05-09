'use client';

import { Task, Comment } from '@prisma/client';
import { useState, useEffect, useTransition } from 'react';
import { addComment, getComments } from '@/app/actions/comments';
import { X, Send, MessageSquare, Clock, Tag, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchComments() {
      const data = await getComments(task.id);
      setComments(data);
    }
    fetchComments();
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
              {task.category && (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-accent/50 text-muted-foreground rounded-lg">
                  <Tag size={12} /> {task.category}
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

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Description</h3>
            <div className="text-base font-medium leading-relaxed bg-accent/20 p-6 rounded-3xl border border-border/10">
              {task.description || 'No description provided.'}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Activity & Threads</h3>
              <div className="px-2.5 py-1 bg-accent/50 rounded-lg text-[10px] font-black text-muted-foreground uppercase">
                {comments.length} Comments
              </div>
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
              {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">No activity yet</p>
                </div>
              )}
            </div>
          </section>
        </div>

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
