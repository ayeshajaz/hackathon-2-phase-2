/**
 * TaskList Component
 *
 * Displays a list of tasks with loading, error, and empty states.
 * Responsive: Grid layout adapts from single column on mobile to multiple columns on larger screens.
 */

'use client';

import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function TaskList() {
  const { data: tasks, isLoading, error, refetch } = useTasks();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
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
      <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
        <svg
          className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">
          No tasks yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
