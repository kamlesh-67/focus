'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '../../lib/supabase/server';
import { Task } from '@prisma/client';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  category: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

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
      return { 
        success: false, 
        error: error.code === '42501' 
          ? 'Permission denied. RLS Violation.' 
          : error.message 
      };
    }

    revalidatePath('/');
    revalidatePath('/calendar');
    logAction('createTask', 'SUCCESS', startTime);
    return { success: true, data: task };
  } catch (e: any) {
    logAction('createTask', 'ERROR', startTime, e.message);
    return { success: false, error: e.message || 'An unexpected error occurred.' };
  }
}

export async function toggleTask(id: string, completed: boolean): Promise<ActionResult<void>> {
  const startTime = Date.now();
  logAction('toggleTask', 'START', startTime, { id, completed });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('toggleTask', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('Task')
      .update({ completed, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .eq('userId', user.id);

    if (error) {
      logAction('toggleTask', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/calendar');
    logAction('toggleTask', 'SUCCESS', startTime);
    return { success: true };
  } catch (e: any) {
    logAction('toggleTask', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}

export async function deleteTask(id: string): Promise<ActionResult<void>> {
  const startTime = Date.now();
  logAction('deleteTask', 'START', startTime, { id });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('deleteTask', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('Task')
      .delete()
      .eq('id', id)
      .eq('userId', user.id);

    if (error) {
      logAction('deleteTask', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/calendar');
    logAction('deleteTask', 'SUCCESS', startTime);
    return { success: true };
  } catch (e: any) {
    logAction('deleteTask', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}

export async function getTasks(): Promise<(Task & { project: { title: string } | null })[]> {
  const startTime = Date.now();
  // We log fetching but don't overwhelm with too many details
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

    if (error) {
      logAction('getTasks', 'ERROR', startTime, error);
      return [];
    }

    return tasks as (Task & { project: { title: string } | null })[];
  } catch (error) {
    logAction('getTasks', 'ERROR', startTime, error);
    return [];
  }
}
