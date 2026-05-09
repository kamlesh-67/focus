'use server';

import { createClient } from '../../lib/supabase/server';
import { ActionResult } from './tasks';

export async function getUserStats(): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('UserStats')
      .select('*')
      .eq('userId', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      return { success: false, error: error.message };
    }

    if (!data) {
      // Initialize stats if not exist
      const newStats = {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        updatedAt: new Date().toISOString()
      };
      await supabase.from('UserStats').insert([newStats]);
      return { success: true, data: newStats };
    }

    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateCompletionStats(): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: stats } = await supabase
      .from('UserStats')
      .select('*')
      .eq('userId', user.id)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats?.lastCompletedDate;

    let newCurrentStreak = stats?.currentStreak || 0;
    let newLongestStreak = stats?.longestStreak || 0;
    const totalCompleted = (stats?.totalCompleted || 0) + 1;

    if (!lastDate) {
      newCurrentStreak = 1;
    } else {
      const last = new Date(lastDate);
      const diffTime = Math.abs(new Date(today).getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrentStreak += 1;
      } else if (diffDays > 1) {
        newCurrentStreak = 1;
      }
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    await supabase
      .from('UserStats')
      .upsert({
        userId: user.id,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalCompleted,
        lastCompletedDate: today,
        updatedAt: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error updating stats:', error);
  }
}
