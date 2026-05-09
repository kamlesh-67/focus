'use server';

import sql from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Project } from '@prisma/client';

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
  const id = `proj_${Math.random().toString(36).substr(2, 9)}`;

  await sql`
    INSERT INTO "Project" (
      "id", "title", "description", "targetDate", "progress", "userId", "updatedAt"
    ) VALUES (
      ${id}, ${data.title}, ${data.description || null}, ${data.targetDate || null}, 
      0, ${userId}, NOW()
    )
  `;
  
  revalidatePath('/goals');
  return { id };
}

export async function getProjects(): Promise<(Project & { progress: number; tasks: any[] })[]> {
  try {
    const userId = await getUserId();
    
    const projects = await sql`
      SELECT * FROM "Project"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;

    const projectsWithProgress = await Promise.all(projects.map(async (p: any) => {
      const tasks = await sql`
        SELECT completed FROM "Task"
        WHERE "projectId" = ${p.id}
      `;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.completed).length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return { 
        id: p.id,
        title: p.title,
        description: p.description,
        targetDate: p.targetDate,
        progress,
        userId: p.userId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        tasks: tasks
      };
    }));

    return projectsWithProgress;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function deleteProject(id: string) {
  const userId = await getUserId();
  await sql`
    DELETE FROM "Project"
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;
  revalidatePath('/goals');
}
