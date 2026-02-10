/**
 * Task Type Definitions
 *
 * Types for task entities and task-related operations.
 */

/**
 * Task entity
 */
export interface Task {
  id: number;                    // Auto-increment ID
  title: string;                 // Max 200 characters
  description: string | null;    // Optional
  completed: boolean;
  owner_user_id: string;         // UUID (from JWT token)
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}

/**
 * Task creation data (for forms)
 */
export interface TaskCreateData {
  title: string;
  description?: string;
}

/**
 * Task update data (for forms)
 */
export interface TaskUpdateData {
  title: string;
  description?: string;
}
