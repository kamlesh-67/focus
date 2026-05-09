'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Comment } from '@prisma/client';

export async function addComment(taskId: string, content: string): Promise<Comment> {
  const id = `comm_${Math.random().toString(36).substr(2, 9)}`;

  const [comment] = await sql`
    INSERT INTO "Comment" (
      "id", "taskId", "content"
    ) VALUES (
      ${id}, ${taskId}, ${content}
    )
    RETURNING *
  `;
  
  revalidatePath('/');
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    taskId: comment.taskId
  };
}

export async function getComments(taskId: string): Promise<Comment[]> {
  try {
    const comments = await sql`
      SELECT * FROM "Comment"
      WHERE "taskId" = ${taskId}
      ORDER BY "createdAt" ASC
    `;
    
    return comments.map((c: any) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      taskId: c.taskId
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}
