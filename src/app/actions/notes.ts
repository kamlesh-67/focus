'use server';

import sql from '@/lib/db';
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
  const id = `note_${Math.random().toString(36).substr(2, 9)}`;

  await sql`
    INSERT INTO "StickyNote" (
      "id", "content", "color", "userId", "updatedAt"
    ) VALUES (
      ${id}, ${content}, ${color || null}, ${userId}, NOW()
    )
  `;
  
  revalidatePath('/notes');
  return { id, content, color };
}

export async function getNotes() {
  try {
    const userId = await getUserId();
    return await sql`
      SELECT * FROM "StickyNote"
      WHERE "userId" = ${userId}
      ORDER BY "updatedAt" DESC
    `;
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
