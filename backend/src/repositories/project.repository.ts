import { query } from '../utils/db';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryInput } from '../validators/project.validator';
import { ProjectRow } from '../types/project.types';

export const createProject = async (input: CreateProjectInput, ownerId: string): Promise<ProjectRow> => {
  const result = await query(
    'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
    [input.name, input.description || null, ownerId]
  );
  return result.rows[0];
};

export const findProjectsByOwner = async (ownerId: string, filters: ProjectQueryInput): Promise<{ data: ProjectRow[]; pagination: any }> => {
  // Pure total count bypasses limit blocks
  const countResult = await query('SELECT COUNT(*) as precise_matches FROM projects WHERE owner_id = $1', [ownerId]);
  const totalCount = parseInt(countResult.rows[0].precise_matches, 10);

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const result = await query(
    'SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [ownerId, limit, offset]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  };
};

export const getProjectStats = async (projectId: string) => {
  const sql = `
    SELECT
      COUNT(*) as "totalTasks",
      COUNT(*) FILTER (WHERE status = 'todo') as todo,
      COUNT(*) FILTER (WHERE status = 'in_progress') as "inProgress",
      COUNT(*) FILTER (WHERE status = 'done') as done,
      COUNT(*) FILTER (WHERE priority = 'high') as "highPriority",
      COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'done') as overdue
    FROM tasks
    WHERE project_id = $1
  `;
  const result = await query(sql, [projectId]);
  
  // pg counts return as stringified BigInts internally, parse down
  const stats = result.rows[0];
  return {
    totalTasks: parseInt(stats.totalTasks, 10) || 0,
    todo: parseInt(stats.todo, 10) || 0,
    inProgress: parseInt(stats.inProgress, 10) || 0,
    done: parseInt(stats.done, 10) || 0,
    highPriority: parseInt(stats.highPriority, 10) || 0,
    overdue: parseInt(stats.overdue, 10) || 0,
  };
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
