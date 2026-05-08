'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProject } from '@/app/actions/projects';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.string().optional().nullable(),
});

type ProjectValues = z.infer<typeof ProjectSchema>;

interface ProjectFormProps {
  onSuccess: () => void;
  initialDateString?: string;
}

export function ProjectForm({ onSuccess, initialDateString }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      targetDate: initialDateString || '',
    },
  });

  const onSubmit = (data: ProjectValues) => {
    startTransition(async () => {
      await createProject({
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      });
      onSuccess();
    });
  };

  const inputClasses = "w-full px-5 py-3 rounded-2xl border border-border/30 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 font-medium";
  const labelClasses = "block text-sm font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className={labelClasses}>Goal Title</label>
        <input
          {...register('title')}
          className={cn(inputClasses, errors.title && "border-destructive focus:ring-destructive/10")}
          placeholder="e.g., Master Advanced Next.js"
          autoFocus
        />
        {errors.title && (
          <p className="text-destructive text-xs font-bold mt-2 ml-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          {...register('description')}
          className={cn(inputClasses, "resize-none min-h-[120px]")}
          placeholder="What does success look like for this goal?"
          rows={3}
        />
      </div>

      <div>
        <label className={labelClasses}>Target Milestone Date</label>
        <input
          {...register('targetDate')}
          type="date"
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl hover:opacity-95 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 mt-4 text-lg"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Creating Goal...</span>
          </div>
        ) : (
          'Set Goal'
        )}
      </button>
    </form>
  );
}
