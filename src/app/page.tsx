import { getTasks } from '@/app/actions/tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { Plus } from 'lucide-react';
import { FAB } from '@/components/ui/fab';

export default async function Home() {
  const tasks = await getTasks();
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">Stay focused and productive.</p>
      </header>

      <section className="space-y-6">
        {pendingTasks.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pending</h2>
            <div className="grid gap-3">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-border/30 rounded-2xl">
            <p className="text-muted-foreground">All caught up! Time for a break?</p>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Completed</h2>
            <div className="grid gap-3">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </section>

      <FAB />
    </div>
  );
}
