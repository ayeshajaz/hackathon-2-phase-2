/**
 * Task API Calls
 *
 * Functions for task CRUD operations.
 */

import { get, post, put, patch, del } from './client';
import { Task } from '@/types/task';
import { TaskCreateRequest, TaskUpdateRequest } from '@/types/api';

/**
 * Get all tasks for the authenticated user
 */
export async function listTasks(): Promise<Task[]> {
  return get<Task[]>('/api/tasks');
}

/**
 * Create a new task
 */
export async function createTask(data: TaskCreateRequest): Promise<Task> {
  return post<Task>('/api/tasks', data);
}

/**
 * Get a single task by ID
 */
export async function getTask(id: number): Promise<Task> {
  return get<Task>(`/api/tasks/${id}`);
}

/**
 * Update a task
 */
export async function updateTask(id: number, data: TaskUpdateRequest): Promise<Task> {
  return put<Task>(`/api/tasks/${id}`, data);
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<void> {
  return del<void>(`/api/tasks/${id}`);
}

/**
 * Mark a task as complete or incomplete
 */
export async function completeTask(id: number, completed: boolean): Promise<Task> {
  return patch<Task>(`/api/tasks/${id}/complete`, { completed });
}
