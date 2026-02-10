/**
 * DeleteTaskDialog Component
 *
 * Confirmation dialog for deleting tasks.
 */

'use client';

import { useState } from 'react';
import { useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/types/api';

interface DeleteTaskDialogProps {
  taskId: number;
  taskTitle: string;
  onSuccess?: () => void;
  onCancel: () => void;
}

export function DeleteTaskDialog({
  taskId,
  taskTitle,
  onSuccess,
  onCancel,
}: DeleteTaskDialogProps) {
  const [error, setError] = useState<string>('');
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    setError('');
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else {
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Task
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete "{taskTitle}"? This action cannot
              be undone.
            </p>
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={deleteTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteTaskMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
