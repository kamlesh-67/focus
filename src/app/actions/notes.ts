'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

export async function createNote(content: string, color?: string) {
  const userId = await getUserId();
  const note = await prisma.stickyNote.create({
    data: { content, color, userId },
  });
  revalidatePath('/notes');
  return note;
}

export async function getNotes() {
  try {
    const userId = await getUserId();
    return await prisma.stickyNote.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function updateNote(id: string, content: string) {
  const userId = await getUserId();
  const note = await prisma.stickyNote.update({
    where: { id, userId },
    data: { content },
  });
  revalidatePath('/notes');
  return note;
}

export async function deleteNote(id: string) {
  const userId = await getUserId();
  await prisma.stickyNote.delete({
    where: { id, userId },
  });
  revalidatePath('/notes');
}
