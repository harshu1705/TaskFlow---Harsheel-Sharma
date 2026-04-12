import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as service from '../services/task.service';
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '../validators/task.validator';
import { UnauthorizedError, NotFoundError } from '../services/project.service';

const handleServiceError = (error: any, res: Response) => {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ success: false, error: 'not found', message: error.message });
  }
  if (error instanceof UnauthorizedError) {
    return res.status(403).json({ success: false, error: 'forbidden', message: error.message });
  }
  console.error(error);
  return res.status(500).json({ success: false, error: 'internal server error' });
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const projectId = req.params.projectId;
    const validatedData = createTaskSchema.parse(req.body);
    const result = await service.createTaskService(projectId, validatedData, ownerId);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, error: 'validation failed', fields: error.flatten().fieldErrors });
    handleServiceError(error, res);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const projectId = req.params.projectId;
    const filters = taskFilterSchema.parse(req.query);
    const result = await service.getTasksService(projectId, filters, ownerId);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error: any) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, error: 'invalid filters', fields: error.flatten().fieldErrors });
    handleServiceError(error, res);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const taskId = req.params.taskId;
    const validatedData = updateTaskSchema.parse(req.body);
    const result = await service.updateTaskService(taskId, validatedData, ownerId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof ZodError) return res.status(400).json({ success: false, error: 'validation failed', fields: error.flatten().fieldErrors });
    handleServiceError(error, res);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const taskId = req.params.taskId;
    await service.deleteTaskService(taskId, ownerId);
    res.status(204).send();
  } catch (error: any) {
    handleServiceError(error, res);
  }
};
