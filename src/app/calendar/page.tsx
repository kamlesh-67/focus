import { getTasks } from '@/app/actions/tasks';
import { CalendarView } from '@/components/calendar/calendar-view';

export default async function CalendarPage() {
  const tasks = await getTasks();
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="p-6 border-b border-border/30 bg-card">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-sm text-muted-foreground">Visualize your schedule and deadlines.</p>
      </header>
      
      <div className="flex-1 p-6 overflow-auto">
        <CalendarView tasks={tasks} />
      </div>
    </div>
  );
}
