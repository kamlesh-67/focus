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

export async function createTask(data: z.infer<typeof TaskSchema>): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
      console.error('Supabase RLS Error:', error);
      return { 
        success: false, 
        error: error.code === '42501' 
          ? 'Permission denied. Please ensure your database tables and RLS policies are set up correctly in Supabase.' 
          : error.message 
      };
    }

    revalidatePath('/');
    revalidatePath('/calendar');
    return { success: true, data: task };
  } catch (e: any) {
    return { success: false, error: e.message || 'An unexpected error occurred.' };
  }
}

export async function toggleTask(id: string, completed: boolean): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('Task')
      .update({ completed, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .eq('userId', user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/calendar');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteTask(id: string): Promise<ActionResult<void>> {
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

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return tasks as (Task & { project: { title: string } | null })[];
  } catch (error) {
    console.error('Error in getTasks:', error);
    return [];
  }
}
