'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

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
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
      completed: false,
    },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
  return task;
}

export async function toggleTask(id: string, completed: boolean) {
  const userId = await getUserId();
  const task = await prisma.task.update({
    where: { id, userId },
    data: { completed },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
  return task;
}

export async function deleteTask(id: string) {
  const userId = await getUserId();
  await prisma.task.delete({
    where: { id, userId },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function getTasks() {
  try {
    const userId = await getUserId();
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    });
  } catch {
    return [];
  }
}
