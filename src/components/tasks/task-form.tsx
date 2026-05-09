'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createTask } from '@/app/actions/tasks';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  category: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  status: z.enum(['Open', 'Analysis', 'Design', 'Development', 'Done', 'Hold', 'Pending']),
});

type TaskValues = z.infer<typeof TaskSchema>;

interface TaskFormProps {
  onSuccess: () => void;
  initialDateString?: string;
}

export function TaskForm({ onSuccess, initialDateString }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      priority: 'Medium',
      status: 'Open',
      dueDate: initialDateString || '',
    },
  });

  const onSubmit = (data: TaskValues) => {
    startTransition(async () => {
      const result = await createTask({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      } as any);

      if (result.success) {
        toast.success('Task created successfully!');
        onSuccess();
      } else {
        toast.error('Failed to create task', {
          description: result.error,
        });
      }
    });
  };

  const inputClasses = "w-full px-5 py-3 rounded-2xl border border-border/30 bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 font-medium";
  const labelClasses = "block text-sm font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-wider";

  const parseSmartInput = (input: string) => {
    const values: any = {};
    
    // Parse tags (#work, #personal)
    const tagMatch = input.match(/#(\w+)/);
    if (tagMatch) {
      values.category = tagMatch[1];
      input = input.replace(tagMatch[0], '').trim();
    }

    // Parse priority (!urgent, !high, !low)
    if (input.toLowerCase().includes('!urgent')) {
      values.priority = 'Urgent';
      input = input.replace(/!urgent/i, '').trim();
    } else if (input.toLowerCase().includes('!high')) {
      values.priority = 'High';
      input = input.replace(/!high/i, '').trim();
    } else if (input.toLowerCase().includes('!low')) {
      values.priority = 'Low';
      input = input.replace(/!low/i, '').trim();
    }

    // Simple date parsing (today, tomorrow)
    const today = new Date();
    if (input.toLowerCase().includes('today')) {
      values.dueDate = today.toISOString().split('T')[0];
      input = input.replace(/today/i, '').trim();
    } else if (input.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      values.dueDate = tomorrow.toISOString().split('T')[0];
      input = input.replace(/tomorrow/i, '').trim();
    }

    return { title: input, ...values };
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { title, category, priority, dueDate } = parseSmartInput(e.target.value);
    if (category) setValue('category', category);
    if (priority) setValue('priority', priority);
    if (dueDate) setValue('dueDate', dueDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className={labelClasses}>Task Title</label>
        <div className="relative">
          <input
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e);
              handleTitleChange(e);
            }}
            className={cn(inputClasses, errors.title && "border-destructive focus:ring-destructive/10")}
            placeholder="e.g., Fix bugs tomorrow #work !high"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="text-[10px] font-black bg-accent px-1.5 py-0.5 rounded text-muted-foreground uppercase">NLP Active</span>
          </div>
        </div>
        {errors.title && (
          <p className="text-destructive text-xs font-bold mt-2 ml-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          {...register('description')}
          className={cn(inputClasses, "resize-none min-h-[100px]")}
          placeholder="Add any additional details or context..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Due Date</label>
          <input
            {...register('dueDate')}
            type="date"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Priority Level</label>
          <div className="relative">
            <select
              {...register('priority')}
              className={cn(inputClasses, "appearance-none")}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Status</label>
          <div className="relative">
            <select
              {...register('status')}
              className={cn(inputClasses, "appearance-none")}
            >
              <option value="Open">Open</option>
              <option value="Analysis">Analysis</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Hold">Hold</option>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className={labelClasses}>Category Tag</label>
          <input
            {...register('category')}
            className={inputClasses}
            placeholder="Work, Personal..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl hover:opacity-95 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 mt-4 text-lg"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          'Create Task'
        )}
      </button>
    </form>
  );
}
