import { getTasks } from '@/app/actions/tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { FAB } from '@/components/ui/fab';
import { CheckCircle2, LayoutList } from 'lucide-react';
import { TutorialOnboarding } from '@/components/ui/tutorial-onboarding';

export default async function Home() {
  const tasks = await getTasks();
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">My Tasks</h1>
        <p className="text-muted-foreground font-medium italic">"The secret of getting ahead is getting started."</p>
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
