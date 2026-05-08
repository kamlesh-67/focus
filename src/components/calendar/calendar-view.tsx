'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@prisma/client';
import { useState } from 'react';
import { TaskDetail } from '../tasks/task-detail';
import { TaskForm } from '../tasks/task-form';
import { ProjectForm } from '../projects/project-form';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckSquare, Target, X } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  Low: '#3b82f6',
  Medium: '#eab308',
  High: '#f97316',
  Urgent: '#ef4444',
};

export function CalendarView({ tasks }: CalendarViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creationDate, setCreationDate] = useState<string | null>(null);
  const [creationType, setCreationType] = useState<'task' | 'project' | null>(null);

  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task.id,
      title: task.title,
      start: task.dueDate!,
      backgroundColor: task.completed ? '#94a3b8' : priorityColors[task.priority] || '#3b82f6',
      borderColor: 'transparent',
      extendedProps: { ...task },
    }));

  return (
    <div className="h-full bg-card rounded-[2.5rem] border-2 border-border/50 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden calendar-container relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        nowIndicator={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={events}
        height="100%"
        editable={false}
        selectable={true}
        dateClick={(info) => {
          setCreationDate(info.dateStr);
          setCreationType(null);
        }}
        eventClick={(info) => {
          setSelectedTask(info.event.extendedProps as Task);
        }}
        eventClassNames={(arg) => {
          const classes = ['rounded-xl', 'px-3', 'py-1.5', 'font-black', 'text-xs', 'shadow-md', 'border-none', 'my-0.5'];
          if (arg.event.extendedProps.completed) {
            classes.push('opacity-60', 'line-through');
          }
          return classes;
        }}
        dayMaxEvents={true}
      />

      <AnimatePresence mode="wait">
        {selectedTask && (
          <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>

      {/* Creation Modal */}
      <AnimatePresence>
        {creationDate && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setCreationDate(null); setCreationType(null); }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-card border border-border/40 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {creationType === 'task' ? 'New Task' : creationType === 'project' ? 'New Goal' : 'Create for ' + creationDate}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {creationType ? 'Fill in the details below' : 'What would you like to create?'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (creationType) {
                      setCreationType(null);
                    } else {
                      setCreationDate(null);
                    }
                  }}
                  className="p-3 bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground rounded-2xl transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              {!creationType ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCreationType('task')}
                    className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="p-4 bg-blue-500/20 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <CheckSquare size={32} />
                    </div>
                    <span className="font-bold text-lg">Task</span>
                  </button>
                  <button
                    onClick={() => setCreationType('project')}
                    className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="p-4 bg-indigo-500/20 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Target size={32} />
                    </div>
                    <span className="font-bold text-lg">Goal</span>
                  </button>
                </div>
              ) : creationType === 'task' ? (
                <TaskForm initialDateString={creationDate} onSuccess={() => { setCreationDate(null); setCreationType(null); }} />
              ) : (
                <ProjectForm initialDateString={creationDate} onSuccess={() => { setCreationDate(null); setCreationType(null); }} />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .calendar-container .fc {
          --fc-border-color: var(--border);
          --fc-button-bg-color: var(--background);
          --fc-button-border-color: var(--border);
          --fc-button-text-color: var(--foreground);
          --fc-button-hover-bg-color: var(--accent);
          --fc-button-hover-border-color: var(--border);
          --fc-button-active-bg-color: var(--primary);
          --fc-button-active-border-color: var(--primary);
          --fc-button-active-text-color: var(--primary-foreground);
          --fc-today-bg-color: rgba(var(--primary), 0.15);
          font-family: inherit;
        }
        
        .calendar-container .fc-theme-standard td, 
        .calendar-container .fc-theme-standard th {
          border: 1px solid var(--border) !important;
          opacity: 1 !important; /* Ensure grid is sharp */
        }

        .calendar-container .fc-toolbar-title {
          font-size: 1.75rem !important;
          font-weight: 900 !important;
          letter-spacing: -0.05em;
          color: var(--foreground);
        }

        .calendar-container .fc-button {
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          font-size: 0.75rem !important;
          border-radius: 1.25rem !important;
          padding: 0.75rem 1.25rem !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: 2px solid var(--border) !important;
          background: var(--background) !important;
          color: var(--foreground) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }

        .calendar-container .fc-button-primary:not(:disabled).fc-button-active,
        .calendar-container .fc-button-primary:not(:disabled):active {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: var(--primary-foreground) !important;
          transform: scale(0.95);
        }

        /* Today's Date Highlighting - Solid & Clear */
        .calendar-container .fc-day-today {
          background: var(--primary) !important;
          background-color: rgba(37, 99, 235, 0.1) !important;
          position: relative;
        }

        .calendar-container .fc-day-today .fc-daygrid-day-number {
          background: var(--primary);
          color: white !important;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 4px;
          font-weight: 900;
        }

        .calendar-container .fc-col-header-cell {
          padding: 1rem 0 !important;
          background: var(--accent)/30;
        }

        .calendar-container .fc-col-header-cell-cushion {
          font-weight: 900 !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.7rem;
          color: var(--muted-foreground);
        }

        .calendar-container .fc-event {
          filter: none !important; /* Remove any blur */
          border: none !important;
        }
      `}</style>
    </div>
  );
}
