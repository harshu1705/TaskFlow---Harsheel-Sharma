import { query } from '../utils/db';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '../validators/task.validator';
import { TaskRow } from '../types/task.types';
import { ProjectRow } from '../types/project.types';

export const findProjectAndOwner = async (projectId: string): Promise<ProjectRow | null> => {
  const result = await query('SELECT * FROM projects WHERE id = $1', [projectId]);
  return result.rows.length ? result.rows[0] : null;
};

export const createTask = async (projectId: string, input: CreateTaskInput): Promise<TaskRow> => {
  const result = await query(
    `INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      input.title, 
      input.description || null, 
      input.status, 
      input.priority, 
      projectId, 
      input.assignee_id || null, 
      input.due_date || null
    ]
  );
  return result.rows[0];
};

export const getTasksByProject = async (projectId: string, filters: TaskFilterInput): Promise<{ data: TaskRow[], pagination: any }> => {
  const values: any[] = [projectId];
  const conditions = ['project_id = $1'];
  
  let paramIdx = 2;
  
  if (filters.status) {
    conditions.push(`status = $${paramIdx++}`);
    values.push(filters.status);
  }
  if (filters.priority) {
    conditions.push(`priority = $${paramIdx++}`);
    values.push(filters.priority);
  }
  if (filters.assignee_id) {
    conditions.push(`assignee_id = $${paramIdx++}`);
    values.push(filters.assignee_id);
  }
  if (filters.search) {
    conditions.push(`(title ILIKE $${paramIdx} OR description ILIKE $${paramIdx})`);
    values.push(`%${filters.search}%`);
    paramIdx++;
  }

  // Raw count query for pure un-paginated total matching constraints
  const countSql = `SELECT COUNT(*) as exact_count FROM tasks WHERE ${conditions.join(' AND ')}`;
  const countResult = await query(countSql, values);
  const totalCount = parseInt(countResult.rows[0].exact_count, 10);

  // Sorting
  const sortBy = filters.sortBy || 'created_at';
  const order = filters.order === 'asc' ? 'ASC' : 'DESC';
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT * FROM tasks 
    WHERE ${conditions.join(' AND ')} 
    ORDER BY ${sortBy} ${order} 
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}
  `;
  
  values.push(limit, offset);
  const result = await query(sql, values);

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

export const findTaskWithProjectOwner = async (taskId: string): Promise<{ task: TaskRow; owner_id: string } | null> => {
  const sql = `
    SELECT t.*, p.owner_id 
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1
  `;
  const result = await query(sql, [taskId]);
  if (!result.rows.length) return null;
  
  const row = result.rows[0];
  const owner_id = row.owner_id;
  delete row.owner_id; // Abstract out owner_id so returning matches TaskRow natively
  return { task: row, owner_id };
};

export const updateTask = async (taskId: string, input: UpdateTaskInput): Promise<TaskRow | null> => {
  const fields = [];
  const values = [];
  let paramIdx = 1;

  // Dynamically map updatable fields
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIdx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(taskId);
  const sql = `UPDATE tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIdx} RETURNING *`;
  
  const result = await query(sql, values);
  return result.rows.length ? result.rows[0] : null;
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING id', [taskId]);
  return (result.rowCount ?? 0) > 0;
};
