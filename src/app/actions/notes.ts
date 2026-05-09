'use server';

import sql from '../../lib/database';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { StickyNote } from '@prisma/client';

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user.id;
}

export async function createNote(content: string, color?: string) {
  const userId = await getUserId();
  const id = `note_${Math.random().toString(36).substr(2, 9)}`;

  const [note] = await sql`
    INSERT INTO "StickyNote" (
      "id", "content", "color", "userId", "updatedAt"
    ) VALUES (
      ${id}, ${content}, ${color || null}, ${userId}, NOW()
    )
    RETURNING *
  `;
  
  revalidatePath('/notes');
  return {
    id: note.id,
    content: note.content,
    color: note.color,
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}

export async function getNotes(): Promise<StickyNote[]> {
  try {
    const userId = await getUserId();
    const notes = await sql`
      SELECT * FROM "StickyNote"
      WHERE "userId" = ${userId}
      ORDER BY "updatedAt" DESC
    `;
    
    return notes.map((n: any) => ({
      id: n.id,
      content: n.content,
      color: n.color,
      userId: n.userId,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function updateNote(id: string, content: string) {
  const userId = await getUserId();
  await sql`
    UPDATE "StickyNote"
    SET "content" = ${content}, "updatedAt" = NOW()
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;
  revalidatePath('/notes');
}

export async function deleteNote(id: string) {
  const userId = await getUserId();
  await sql`
    DELETE FROM "StickyNote"
    WHERE "id" = ${id} AND "userId" = ${userId}
  `;
  revalidatePath('/notes');
}
