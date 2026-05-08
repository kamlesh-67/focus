'use server';

import { prisma } from '@/lib/prisma';
import { Project, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.date().optional().nullable(),
});

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

export async function createProject(data: z.infer<typeof ProjectSchema>) {
  const userId = await getUserId();
  const project = await prisma.project.create({
    data: { ...data, userId },
  });
  revalidatePath('/goals');
  return project;
}

export async function getProjects() {
  try {
    const userId = await getUserId();
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p: Project & { tasks: Task[] }) => {
      const completedTasks = p.tasks.filter((t) => t.completed).length;
      const totalTasks = p.tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      return { ...p, progress };
    });
  } catch {
    return [];
  }
}

export async function deleteProject(id: string) {
  const userId = await getUserId();
  await prisma.project.delete({
    where: { id, userId },
  });
  revalidatePath('/goals');
}
