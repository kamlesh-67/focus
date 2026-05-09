'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Task } from '@prisma/client';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  category: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

export async function createTask(data: z.infer<typeof TaskSchema>) {
  const userId = await getUserId();
  const id = `task_${Math.random().toString(36).substr(2, 9)}`; 
  
  await sql`
    INSERT INTO "Task" (
      "id", "title", "description", "dueDate", "priority", "category", "completed", "userId", "projectId", "updatedAt"
    ) VALUES (
      ${id}, ${data.title}, ${data.description || null}, ${data.dueDate || null}, 
      ${data.priority}, ${data.category || null}, false, ${userId}, ${data.projectId || null}, NOW()
    )
  `;
  
  revalidatePath('/');
  revalidatePath('/calendar');
  return { id };
}

export async function toggleTask(id: string, completed: boolean) {
  const userId = await getUserId();
  await sql`
    UPDATE "Task"
    SET "completed" = ${completed}, "updatedAt" = NOW()
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function deleteTask(id: string) {
  const userId = await getUserId();
  await sql`
    DELETE FROM "Task"
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function getTasks(): Promise<(Task & { project: { title: string } | null })[]> {
  try {
    const userId = await getUserId();
    const tasks = await sql`
      SELECT t.*, p.title as "project_title"
      FROM "Task" t
      LEFT JOIN "Project" p ON t."projectId" = p.id
      WHERE t."userId" = ${userId}
      ORDER BY t."createdAt" DESC
    `;

    return tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
      category: t.category,
      completed: t.completed,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      userId: t.userId,
      projectId: t.projectId,
      project: t.project_title ? { title: t.project_title } : null
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}
