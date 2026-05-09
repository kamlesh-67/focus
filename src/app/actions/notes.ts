'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { StickyNote } from '@prisma/client';
import { ActionResult } from './tasks';

const logAction = (name: string, status: 'START' | 'SUCCESS' | 'ERROR', startTime?: number, details?: any) => {
  const timestamp = new Date().toISOString();
  const duration = startTime ? ` (${Date.now() - startTime}ms)` : '';
  console.log(`[${timestamp}] [ACTION: ${name}] [${status}]${duration}`, details || '');
};

export async function createNote(content: string, color?: string): Promise<ActionResult<StickyNote>> {
  const startTime = Date.now();
  logAction('createNote', 'START', startTime);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('createNote', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'Unauthorized' };
    }

    const id = `note_${Math.random().toString(36).substring(2, 11)}`;

    const { data: note, error } = await supabase
      .from('StickyNote')
      .insert([{
        id,
        content,
        color,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      logAction('createNote', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/notes');
    logAction('createNote', 'SUCCESS', startTime);
    return { success: true, data: note as StickyNote };
  } catch (e: any) {
    logAction('createNote', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}

export async function getNotes(): Promise<StickyNote[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: notes, error } = await supabase
      .from('StickyNote')
      .select('*')
      .eq('userId', user.id)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return notes as StickyNote[];
  } catch (error) {
    console.error('Error in getNotes:', error);
    return [];
  }
}

export async function updateNote(id: string, content: string): Promise<ActionResult<void>> {
  const startTime = Date.now();
  logAction('updateNote', 'START', startTime, { id });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('updateNote', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('StickyNote')
      .update({ content, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .eq('userId', user.id);

    if (error) {
      logAction('updateNote', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/notes');
    logAction('updateNote', 'SUCCESS', startTime);
    return { success: true };
  } catch (e: any) {
    logAction('updateNote', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}

export async function deleteNote(id: string): Promise<ActionResult<void>> {
  const startTime = Date.now();
  logAction('deleteNote', 'START', startTime, { id });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('deleteNote', 'ERROR', startTime, 'Unauthorized');
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('StickyNote')
      .delete()
      .eq('id', id)
      .eq('userId', user.id);

    if (error) {
      logAction('deleteNote', 'ERROR', startTime, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/notes');
    logAction('deleteNote', 'SUCCESS', startTime);
    return { success: true };
  } catch (e: any) {
    logAction('deleteNote', 'ERROR', startTime, e.message);
    return { success: false, error: e.message };
  }
}
