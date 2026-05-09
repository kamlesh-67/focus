'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '../../lib/supabase/server';
import { Project, Task } from '@prisma/client';
import { ActionResult } from './tasks';

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.date().optional().nullable(),
});

export async function createProject(data: z.infer<typeof ProjectSchema>): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const id = `proj_${Math.random().toString(36).substring(2, 11)}`;

    const { data: project, error } = await supabase
      .from('Project')
      .insert([{
        id,
        ...data,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/goals');
    return { success: true, data: project };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getProjects(): Promise<(Project & { progress: number; tasks: any[] })[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: projects, error } = await supabase
      .from('Project')
      .select(`
        *,
        tasks:Task(completed)
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return projects.map((p: any) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t: any) => t.completed).length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return { 
        ...p, 
        progress
      };
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
}

export async function deleteProject(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('id', id)
      .eq('userId', user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/goals');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
