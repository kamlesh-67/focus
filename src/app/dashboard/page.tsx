import { getTasks } from '@/app/actions/tasks';
import { getUserStats } from '@/app/actions/stats';
import { TaskCard } from '@/components/tasks/task-card';
import { FAB } from '@/components/ui/fab';
import { CheckCircle2, LayoutList, Flame, Trophy, Target } from 'lucide-react';
import { TutorialOnboarding } from '@/components/ui/tutorial-onboarding';

export default async function Home() {
  const [tasks, statsResult] = await Promise.all([
    getTasks(),
    getUserStats()
  ]);
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const stats = statsResult.data;

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">My Tasks</h1>
          <p className="text-muted-foreground font-medium italic">"The secret of getting ahead is getting started."</p>
        </div>

        {stats && (
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 min-w-[100px]">
              <Flame className="text-orange-500 mb-1" size={20} strokeWidth={3} />
              <span className="text-xl font-black text-orange-500 leading-none">{stats.currentStreak}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 mt-1">Streak</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-2xl border border-primary/20 min-w-[100px]">
              <Trophy className="text-primary mb-1" size={20} strokeWidth={3} />
              <span className="text-xl font-black text-primary leading-none">{stats.totalCompleted}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-1">Total</span>
            </div>
          </div>
        )}
      </header>

      <section className="space-y-10">
        {pendingTasks.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground ml-1">
              <LayoutList size={16} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">In Progress ({pendingTasks.length})</h2>
            </div>
            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] bg-accent/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-2">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">You're all clear!</h3>
            <p className="text-muted-foreground font-bold max-w-[280px]">All tasks are finished. Enjoy your peace of mind or start something new.</p>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2 text-muted-foreground ml-1">
              <CheckCircle2 size={16} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Completed</h2>
            </div>
            <div className="grid gap-3 opacity-60 grayscale-[0.2]">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </section>

      <FAB />
      <TutorialOnboarding />
    </div>
  );
}
