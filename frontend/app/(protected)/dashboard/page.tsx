/**
 * Dashboard Page
 *
 * Main task management dashboard for authenticated users.
 */

'use client';

import { useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold b-2 bg-indigo-300 bg-clip-text text-transparent">
              My Tasks
            </h2>
            <p className="text-gray-200">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {showCreateForm ? 'Cancel' : 'Create Task'}
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-6 animate-slide-up">
            <CreateTaskForm
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <TaskList />
      </div>
    </div>
  );
}
