/**
 * TaskList Component
 *
 * Displays a list of tasks with loading, error, and empty states.
 * Responsive: Grid layout adapts from single column on mobile to multiple columns on larger screens.
 */

'use client';

import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function TaskList() {
  const { data: tasks, isLoading, error, refetch } = useTasks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl h-32"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load tasks. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-white/20 shadow-xl">
        <svg
          className="h-16 w-16 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-white">
          No tasks yet
        </h3>
        <p className="mt-2 text-sm text-gray-300">
          Get started by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
