'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addComment(taskId: string, content: string) {
  const id = `comm_${Math.random().toString(36).substr(2, 9)}`;

  await sql`
    INSERT INTO "Comment" (
      "id", "taskId", "content"
    ) VALUES (
      ${id}, ${taskId}, ${content}
    )
  `;
  
  revalidatePath('/');
  return { id, taskId, content, createdAt: new Date() };
}

export async function getComments(taskId: string) {
  try {
    return await sql`
      SELECT * FROM "Comment"
      WHERE "taskId" = ${taskId}
      ORDER BY "createdAt" ASC
    `;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}
