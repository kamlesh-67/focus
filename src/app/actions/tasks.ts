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

export async function createTask(data: z.infer<typeof TaskSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: task, error } = await supabase
    .from('Task')
    .insert([{
      ...data,
      userId: user.id,
      completed: false,
      updatedAt: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/calendar');
  return task;
}

export async function toggleTask(id: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('Task')
    .update({ completed, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    console.error('Error toggling task:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('Task')
    .delete()
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/calendar');
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
