'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addComment(taskId: string, content: string) {
  const comment = await prisma.comment.create({
    data: {
      taskId,
      content,
    },
  });
  revalidatePath('/');
  return comment;
}

export async function getComments(taskId: string) {
  return await prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: 'asc' },
  });
}
