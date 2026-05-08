'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  category: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export async function createTask(data: z.infer<typeof TaskSchema>) {
  const task = await prisma.task.create({
    data: {
      ...data,
      completed: false,
    },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
  return task;
}

export async function toggleTask(id: string, completed: boolean) {
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
  return task;
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function getTasks() {
  return await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: { project: true },
  });
}
