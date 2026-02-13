/**
 * TaskItem Component
 *
 * Displays an individual task with premium card styling, hover effects, and action buttons.
 * Responsive: Compact layout on mobile with larger tap targets, expanded layout on desktop.
 */

'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { EditTaskForm } from './EditTaskForm';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { useToggleComplete } from '@/hooks/useTasks';
import { ApiError } from '@/types/api';
import { cn } from '@/lib/utils/cn';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string>('');
  const toggleCompleteMutation = useToggleComplete();

  const handleToggleComplete = async () => {
    setError('');
    try {
      await toggleCompleteMutation.mutateAsync({
        id: task.id,
        completed: !task.completed,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else {
        setError('Failed to update task status. Please try again.');
      }
    }
  };

  if (isEditing) {
    return <EditTaskForm task={task} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <>
      <div
        className={cn(
          'backdrop-blur-xl rounded-2xl border p-6',
          'shadow-xl transition-all duration-300',
          'hover:scale-105',
          task.completed
            ? 'bg-slate-900/50 border-white/10 opacity-75'
            : 'bg-slate-950/30 border-white/20 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/50'
        )}
      >
        <div className="flex items-start space-x-3">
          {/* Completion checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={toggleCompleteMutation.isPending}
            className={cn(
              'flex-shrink-0 mt-1 h-6 w-6 rounded border-2',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-300',
              task.completed
                ? 'border-green-500 bg-green-500 shadow-lg shadow-green-500/50'
                : 'border-gray-400 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30'
            )}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <svg
                className="h-full w-full text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-lg font-medium break-words',
                task.completed ? 'text-gray-400 line-through' : 'text-white'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={cn(
                  'mt-2 text-sm break-words',
                  task.completed ? 'text-gray-500' : 'text-gray-300'
                )}
              >
                {task.description}
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-300 bg-red-500/20 border border-red-500/50 rounded px-2 py-1">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-sm px-3 py-1 text-indigo-300 hover:text-indigo-200"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="text-sm px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteTaskDialog
          taskId={task.id}
          taskTitle={task.title}
          onSuccess={() => setShowDeleteDialog(false)}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
