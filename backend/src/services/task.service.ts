import * as repository from '../repositories/task.repository';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '../validators/task.validator';
import { UnauthorizedError, NotFoundError } from './project.service';
import { query } from '../utils/db'; // We reuse query purely to check users existence

const checkAssigneeExists = async (assigneeId: string): Promise<void> => {
  const res = await query('SELECT id FROM users WHERE id = $1', [assigneeId]);
  if (!res.rows.length) {
    throw new NotFoundError('Assignee user does not exist');
  }
};

export const createTaskService = async (projectId: string, input: CreateTaskInput, ownerId: string) => {
  const project = await repository.findProjectAndOwner(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.owner_id !== ownerId) throw new UnauthorizedError();

  if (input.assignee_id) {
    await checkAssigneeExists(input.assignee_id);
  }

  return repository.createTask(projectId, input);
};

export const getTasksService = async (projectId: string, filters: TaskFilterInput, ownerId: string) => {
  const project = await repository.findProjectAndOwner(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.owner_id !== ownerId) throw new UnauthorizedError();

  return repository.getTasksByProject(projectId, filters);
};

export const updateTaskService = async (taskId: string, input: UpdateTaskInput, ownerId: string) => {
  const record = await repository.findTaskWithProjectOwner(taskId);
  if (!record) throw new NotFoundError('Task not found');
  if (record.owner_id !== ownerId) throw new UnauthorizedError();

  if (input.assignee_id) {
    await checkAssigneeExists(input.assignee_id);
  }

  return repository.updateTask(taskId, input);
};

export const deleteTaskService = async (taskId: string, ownerId: string) => {
  const record = await repository.findTaskWithProjectOwner(taskId);
  if (!record) throw new NotFoundError('Task not found');
  if (record.owner_id !== ownerId) throw new UnauthorizedError();

  return repository.deleteTask(taskId);
};
