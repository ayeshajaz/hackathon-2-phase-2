/**
 * EditTaskForm Component
 *
 * Modern modal form for editing existing tasks with premium styling.
 * Responsive: Full-width on mobile, optimized spacing on larger screens.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateTask } from '@/hooks/useTasks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/types/api';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils/cn';

interface EditTaskFormData {
  title: string;
  description?: string;
}

interface EditTaskFormProps {
  task: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditTaskForm({ task, onSuccess, onCancel }: EditTaskFormProps) {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const updateTaskMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description || '',
    },
  });

  const onSubmit = async (data: EditTaskFormData) => {
    setError('');
    setSuccessMessage('');

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: {
          title: data.title,
          description: data.description || undefined,
        },
      });

      setSuccessMessage('Task updated successfully!');

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else {
        setError('Failed to update task. Please try again.');
      }
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-white/20 shadow-2xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Edit Task</h3>
        <p className="mt-1 text-sm text-gray-300">Update your task details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-300">
        <Input
          label="Title"
          placeholder="Enter task title"
          error={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 200,
              message: 'Title must be 200 characters or less',
            },
            validate: (value) =>
              value.trim().length > 0 || 'Title cannot be empty',
          })}
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Enter task description"
            className={cn(
              'w-full px-4 py-3 border rounded-lg',
              'bg-white/5 backdrop-blur-sm border-white/20',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
              'transition-all duration-300 resize-none',
              'text-white placeholder-gray-300'
            )}
            {...register('description')}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            isLoading={updateTaskMutation.isPending}
            className="w-full sm:flex-1 min-h-[44px]"
          >
            Save Changes
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={updateTaskMutation.isPending}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
