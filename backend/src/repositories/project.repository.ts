import { query } from '../utils/db';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { ProjectRow } from '../types/project.types';

export const createProject = async (input: CreateProjectInput, ownerId: string): Promise<ProjectRow> => {
  const result = await query(
    'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
    [input.name, input.description || null, ownerId]
  );
  return result.rows[0];
};

export const findProjectsByOwner = async (ownerId: string): Promise<ProjectRow[]> => {
  const result = await query(
    'SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC',
    [ownerId]
  );
  return result.rows;
};

export const findProjectById = async (projectId: string): Promise<ProjectRow | null> => {
  const result = await query(
    'SELECT * FROM projects WHERE id = $1',
    [projectId]
  );
  return result.rows.length ? result.rows[0] : null;
};

export const updateProject = async (projectId: string, input: UpdateProjectInput): Promise<ProjectRow | null> => {
  const fields = [];
  const values = [];
  let paramIdx = 1;

  if (input.name !== undefined) {
    fields.push(`name = $${paramIdx++}`);
    values.push(input.name);
  }
  
  if (input.description !== undefined) {
    fields.push(`description = $${paramIdx++}`);
    values.push(input.description);
  }

  if (fields.length === 0) return null;

  values.push(projectId);
  const sql = `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramIdx} RETURNING *`;
  
  const result = await query(sql, values);
  return result.rows.length ? result.rows[0] : null;
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [projectId]);
  return (result.rowCount ?? 0) > 0;
};
