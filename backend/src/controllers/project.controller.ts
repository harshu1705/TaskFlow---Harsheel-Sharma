import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as service from '../services/project.service';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const handleServiceError = (error: any, res: Response) => {
  if (error instanceof service.NotFoundError) {
    return res.status(404).json({ error: 'not found', message: error.message });
  }
  if (error instanceof service.UnauthorizedError) {
    return res.status(403).json({ error: 'forbidden', message: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: 'internal server error' });
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id; // Guaranteed by auth.middleware
    const validatedData = createProjectSchema.parse(req.body);
    const result = await service.createProjectService(validatedData, ownerId);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) return res.status(400).json({ error: 'validation failed', fields: error.flatten().fieldErrors });
    handleServiceError(error, res);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const result = await service.getUserProjectsService(ownerId);
    res.status(200).json(result);
  } catch (error: any) {
    handleServiceError(error, res);
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const projectId = req.params.id;
    const result = await service.getProjectByIdService(projectId, ownerId);
    res.status(200).json(result);
  } catch (error: any) {
    handleServiceError(error, res);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const projectId = req.params.id;
    const validatedData = updateProjectSchema.parse(req.body);
    const result = await service.updateProjectService(projectId, validatedData, ownerId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) return res.status(400).json({ error: 'validation failed', fields: error.flatten().fieldErrors });
    handleServiceError(error, res);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const projectId = req.params.id;
    await service.deleteProjectService(projectId, ownerId);
    res.status(204).send();
  } catch (error: any) {
    handleServiceError(error, res);
  }
};
