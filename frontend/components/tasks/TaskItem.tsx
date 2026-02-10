/**
 * TaskItem Component
 *
 * Displays an individual task with title, description, completion status, and action buttons.
 * Responsive: Compact layout on mobile with larger tap targets, expanded layout on desktop.
 */

'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { EditTaskForm } from './EditTaskForm';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { Card } from '@/components/ui/Card';
import { useToggleComplete } from '@/hooks/useTasks';
import { ApiError } from '@/types/api';

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
    return (
      <Card>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Edit Task
        </h3>
        <EditTaskForm
          task={task}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Completion checkbox - larger tap target on mobile */}
          <button
            onClick={handleToggleComplete}
            disabled={toggleCompleteMutation.isPending}
            className="flex-shrink-0 mt-1 h-6 w-6 sm:h-5 sm:w-5 rounded border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <svg
                className="h-full w-full text-blue-600"
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
              className={`text-base sm:text-lg font-medium break-words ${
                task.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm break-words ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>
                Created: {new Date(task.created_at).toLocaleDateString()}
              </span>
              {task.completed && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed
                </span>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Action buttons - stack on mobile, inline on desktop */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="text-sm min-h-[44px] sm:min-h-0"
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteDialog(true)}
              className="text-sm min-h-[44px] sm:min-h-0"
            >
              Delete
            </Button>
          </div>
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
