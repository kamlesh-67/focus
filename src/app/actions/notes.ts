'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { StickyNote } from '@prisma/client';

export async function createNote(content: string, color?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

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
    console.error('Error creating note:', error);
    throw new Error(error.message);
  }

  revalidatePath('/notes');
  return note;
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

export async function updateNote(id: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('StickyNote')
    .update({ content, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    console.error('Error updating note:', error);
    throw new Error(error.message);
  }

  revalidatePath('/notes');
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('StickyNote')
    .delete()
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    console.error('Error deleting note:', error);
    throw new Error(error.message);
  }

  revalidatePath('/notes');
}
