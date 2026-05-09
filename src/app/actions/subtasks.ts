'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { ActionResult } from './tasks';

export async function addSubTask(taskId: string, title: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const id = `sub_${Math.random().toString(36).substring(2, 11)}`;

    const { data, error } = await supabase
      .from('SubTask')
      .insert([{
        id,
        title,
        taskId,
        completed: false,
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function toggleSubTask(id: string, completed: boolean): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('SubTask')
      .update({ completed, updatedAt: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteSubTask(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('SubTask')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getSubTasks(taskId: string): Promise<any[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('SubTask')
      .select('*')
      .eq('taskId', taskId)
      .order('createdAt', { ascending: true });

    if (error) return [];
    return data;
  } catch {
    return [];
  }
}
