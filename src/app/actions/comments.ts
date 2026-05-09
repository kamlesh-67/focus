'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { Comment } from '@prisma/client';

export async function addComment(taskId: string, content: string): Promise<Comment> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: comment, error } = await supabase
    .from('Comment')
    .insert([{
      taskId,
      content
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  return comment as Comment;
}

export async function getComments(taskId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();
    const { data: comments, error } = await supabase
      .from('Comment')
      .select('*')
      .eq('taskId', taskId)
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return comments as Comment[];
  } catch (error) {
    console.error('Error in getComments:', error);
    return [];
  }
}
