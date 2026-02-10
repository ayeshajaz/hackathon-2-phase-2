/**
 * CreateTaskForm Component
 *
 * Form for creating new tasks with title and optional description.
 * Responsive: Full-width on mobile, optimized spacing on larger screens.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '@/hooks/useTasks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/types/api';

interface CreateTaskFormData {
  title: string;
  description?: string;
}

interface CreateTaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTaskForm({ onSuccess, onCancel }: CreateTaskFormProps) {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const createTaskMutation = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>();

  const onSubmit = async (data: CreateTaskFormData) => {
    setError('');
    setSuccessMessage('');

    try {
      await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
      });

      setSuccessMessage('Task created successfully!');
      reset(); // Clear form on success

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.getUserMessage());
      } else {
        setError('Failed to create task. Please try again.');
      }
      // Form data is preserved on error (don't call reset)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter task description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          {...register('description')}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          isLoading={createTaskMutation.isPending}
          className="w-full sm:flex-1 min-h-[44px] sm:min-h-0"
        >
          Create Task
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={createTaskMutation.isPending}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
