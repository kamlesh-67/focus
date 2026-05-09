'use client';

import { toast } from 'sonner';

export const scheduleNotification = (title: string, options: NotificationOptions, delayMs: number) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  setTimeout(() => {
    try {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon.svg',
          badge: '/icon.svg',
          ...options,
        });
      });
    } catch (e) {
      new Notification(title, options);
    }
  }, delayMs);
};

export const checkDeadlinesAndNotify = (tasks: any[]) => {
  const now = new Date().getTime();
  
  tasks.forEach(task => {
    if (!task.dueDate || task.completed) return;
    
    const dueDate = new Date(task.dueDate).getTime();
    const diff = dueDate - now;
    
    // Notify if due in exactly 10 minutes (within a 1-min window check)
    // or if overdue and not yet notified (simplified for client-side demo)
    if (diff > 0 && diff < 600000) { 
      scheduleNotification("Upcoming Deadline", {
        body: `"${task.title}" is due in less than 10 minutes!`,
        tag: `task-${task.id}`,
      } as any, 0);
    }
  });
};
