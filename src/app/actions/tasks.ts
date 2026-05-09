'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

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
  const id = `task_${Math.random().toString(36).substr(2, 9)}`; // simple cuid replacement
  
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

export async function getTasks() {
  try {
    const userId = await getUserId();
    const tasks = await sql`
      SELECT t.*, p.title as "projectTitle"
      FROM "Task" t
      LEFT JOIN "Project" p ON t."projectId" = p.id
      WHERE t."userId" = ${userId}
      ORDER BY t."createdAt" DESC
    `;
    
    // Format for frontend (Project relation)
    return tasks.map(t => ({
      ...t,
      project: t.projectTitle ? { title: t.projectTitle } : null
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}
