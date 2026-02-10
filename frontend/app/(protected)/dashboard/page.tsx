/**
 * Dashboard Page
 *
 * Main task management dashboard for authenticated users.
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-0"
          >
            {showCreateForm ? 'Hide Form' : 'Create Task'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Create New Task
            </h3>
            <CreateTaskForm
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </Card>
        )}

        <TaskList />
      </main>
    </div>
  );
}
