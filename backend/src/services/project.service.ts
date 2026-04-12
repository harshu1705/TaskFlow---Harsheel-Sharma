import * as repository from '../repositories/project.repository';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { ProjectRow } from '../types/project.types';

export class UnauthorizedError extends Error {
  constructor(message: string = 'Forbidden: You do not own this resource') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

const verifyOwnership = async (projectId: string, userId: string): Promise<ProjectRow> => {
  const project = await repository.findProjectById(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.owner_id !== userId) throw new UnauthorizedError();
  return project;
};

export const createProjectService = async (input: CreateProjectInput, ownerId: string) => {
  return repository.createProject(input, ownerId);
};

export const getUserProjectsService = async (ownerId: string) => {
  return repository.findProjectsByOwner(ownerId);
};

export const getProjectByIdService = async (projectId: string, ownerId: string) => {
  return verifyOwnership(projectId, ownerId);
};

export const updateProjectService = async (projectId: string, input: UpdateProjectInput, ownerId: string) => {
  await verifyOwnership(projectId, ownerId);
  return repository.updateProject(projectId, input);
};

export const deleteProjectService = async (projectId: string, ownerId: string) => {
  await verifyOwnership(projectId, ownerId);
  return repository.deleteProject(projectId);
};
