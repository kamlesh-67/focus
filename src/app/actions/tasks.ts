'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '../../lib/supabase/server';
import { Task } from '@prisma/client';

export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  category: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  status: z.enum(['Open', 'Analysis', 'Design', 'Development', 'Done', 'Hold', 'Pending']).default('Open'),
});

const logAction = (name: string, status: 'START' | 'SUCCESS' | 'ERROR', startTime?: number, details?: any) => {
  const timestamp = new Date().toISOString();
  const duration = startTime ? ` (${Date.now() - startTime}ms)` : '';
  console.log(`[${timestamp}] [ACTION: ${name}] [${status}]${duration}`, details || '');
};

export async function createTask(data: z.infer<typeof TaskSchema>): Promise<ActionResult<any>> {
  const startTime = Date.now();
  logAction('createTask', 'START', startTime, { title: data.title });
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logAction('createTask', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'You must be logged in to create a task.' };
    }

    const id = `task_${Math.random().toString(36).substring(2, 11)}`;
    
    const { data: task, error } = await supabase
      .from('Task')
      .insert([{
        id,
        ...data,
        userId: user.id,
        completed: false,
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      logAction('createTask', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/calendar');
    logAction('createTask', 'SUCCESS', startTime);
    return { success: true, data: task };
  } catch (e: any) {
    logAction('createTask', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}

export async function toggleTask(id: string, completed: boolean): Promise<ActionResult<void>> {
  const startTime = Date.now();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('Task')
      .update({ 
        completed, 
        status: completed ? 'Done' : 'Open',
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('userId', user.id);

    if (error) return { success: false, error: error.message };

    if (completed) {
      const { updateCompletionStats } = await import('./stats');
      await updateCompletionStats();
    }

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/calendar');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateTaskStatus(id: string, status: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('Task')
      .update({ 
        status, 
        completed: status === 'Done',
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('userId', user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteTask(id: string): Promise<ActionResult<void>> {
  const startTime = Date.now();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('Task')
      .delete()
      .eq('id', id)
      .eq('userId', user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/calendar');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getTasks(): Promise<(Task & { project: { title: string } | null })[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: tasks, error } = await supabase
      .from('Task')
      .select(`
        *,
        project:Project(title)
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    if (error) return [];
    return tasks as (Task & { project: { title: string } | null })[];
  } catch {
    return [];
  }
}
