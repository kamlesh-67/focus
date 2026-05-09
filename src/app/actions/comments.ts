'use server';

import sql from '../../lib/database';
import { revalidatePath } from 'next/cache';
import { Comment } from '@prisma/client';
import { createClient } from '../../lib/supabase/server';

const logAction = (name: string, status: 'START' | 'SUCCESS' | 'ERROR', startTime?: number, details?: any) => {
  const timestamp = new Date().toISOString();
  const duration = startTime ? ` (${Date.now() - startTime}ms)` : '';
  console.log(`[${timestamp}] [ACTION: ${name}] [${status}]${duration}`, details || '');
};

export async function addComment(taskId: string, content: string): Promise<Comment | null> {
  const startTime = Date.now();
  logAction('addComment', 'START', startTime, { taskId });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logAction('addComment', 'ERROR', startTime, 'Unauthorized');
      return null;
    }

    const { data: comment, error } = await supabase
      .from('Comment')
      .insert([{
        taskId,
        content
      }])
      .select()
      .single();

    if (error) {
      logAction('addComment', 'ERROR', startTime, error);
      return null;
    }

    revalidatePath('/');
    logAction('addComment', 'SUCCESS', startTime);
    return comment as Comment;
  } catch (e: any) {
    logAction('addComment', 'ERROR', startTime, e.message);
    return null;
  }
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
