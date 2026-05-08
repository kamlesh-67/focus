'use client';

import { Project, Task } from '@prisma/client';
import { Calendar, CheckCircle2, ChevronRight, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project & { tasks: Task[]; progress: number };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/30 rounded-2xl p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{project.title}</h3>
          {project.description && (
            <p className="text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
          )}
        </div>
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 size={16} />
              <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} Tasks</span>
            </div>
            {project.targetDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar size={16} />
                <span>{new Date(project.targetDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <span className="font-bold">{project.progress}%</span>
        </div>

        <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-primary"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button className="text-sm font-semibold flex items-center gap-1 hover:text-primary transition-colors">
            View Details <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
