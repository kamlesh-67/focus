'use server';

import { prisma } from '@/lib/prisma';
import { Project, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.date().optional().nullable(),
});

export async function createProject(data: z.infer<typeof ProjectSchema>) {
  const project = await prisma.project.create({
    data,
  });
  revalidatePath('/goals');
  return project;
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
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
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath('/goals');
}
