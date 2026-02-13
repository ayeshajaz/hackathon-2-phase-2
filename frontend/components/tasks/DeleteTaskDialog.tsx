/**
 * DeleteTaskDialog Component
 *
 * Modern confirmation dialog for deleting tasks with premium styling.
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="backdrop-blur-xl bg-slate-800/40 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-500/20 max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-400"
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
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Task
            </h3>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <span className="font-medium text-white">"{taskTitle}"</span>? This action cannot be undone.
            </p>
            {error && (
              <div className="mt-3 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={deleteTaskMutation.isPending}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteTaskMutation.isPending}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
}
