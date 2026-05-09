'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className="h-full bg-card rounded-[2.5rem] border-2 border-border/40 p-4 md:p-8 shadow-xl overflow-hidden calendar-container relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? "dayGridMonth" : "dayGridMonth"} // Can add listWeek for mobile later
        nowIndicator={true}
        headerToolbar={isMobile ? {
          left: 'prev,next',
          center: 'title',
          right: 'today'
        } : {
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
          const classes = ['rounded-xl', 'px-2', 'py-1', 'font-black', 'text-[10px]', 'shadow-md', 'border-none'];
          if (arg.event.extendedProps.completed) {
            classes.push('opacity-60', 'line-through');
          }
          return classes;
        }}
        dayMaxEvents={2} // Better for mobile visibility
      />

      <AnimatePresence mode="wait">
        {selectedTask && (
          <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>

      {/* Creation Modal */}
      <AnimatePresence>
        {creationDate && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setCreationDate(null); setCreationType(null); }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-card border-2 border-border/40 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {creationType === 'task' ? 'New Task' : creationType === 'project' ? 'New Goal' : 'Create for ' + creationDate}
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    if (creationType) {
                      setCreationType(null);
                    } else {
                      setCreationDate(null);
                    }
                  }}
                  className="p-3 bg-accent rounded-2xl active:scale-90"
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
          --fc-button-active-bg-color: var(--primary);
          --fc-button-active-border-color: var(--primary);
          --fc-today-bg-color: rgba(var(--primary), 0.1);
          font-family: inherit;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid var(--border) !important;
        }
        .fc-scrollgrid {
          border: none !important;
        }
        .fc-toolbar-title {
          font-weight: 900 !important;
          letter-spacing: -0.05em;
        }
        .fc-button {
          font-weight: 800 !important;
          text-transform: uppercase !important;
          border-radius: 1rem !important;
          font-size: 0.7rem !important;
        }
        @media (max-width: 768px) {
          .fc-daygrid-day-number {
             font-size: 0.8rem !important;
             font-weight: 900;
          }
          .fc-col-header-cell-cushion {
             font-size: 0.6rem !important;
          }
        }
      `}</style>
    </div>
  );
}
