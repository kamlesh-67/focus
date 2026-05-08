'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createNote(content: string, color?: string) {
  const note = await prisma.stickyNote.create({
    data: { content, color },
  });
  revalidatePath('/notes');
  return note;
}

export async function getNotes() {
  return await prisma.stickyNote.findMany({
    orderBy: { updatedAt: 'desc' },
  });
}

export async function updateNote(id: string, content: string) {
  const note = await prisma.stickyNote.update({
    where: { id },
    data: { content },
  });
  revalidatePath('/notes');
  return note;
}

export async function deleteNote(id: string) {
  await prisma.stickyNote.delete({
    where: { id },
  });
  revalidatePath('/notes');
}
