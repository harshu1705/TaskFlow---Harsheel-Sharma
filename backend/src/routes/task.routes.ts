import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} from '../controllers/task.controller';

const router = Router();

router.use(requireAuth);

// Notice these endpoints merge logically into /projects and /tasks on app.ts
// But for separation, we group them here by exact routes.

// Project-nested routes
router.post('/projects/:projectId/tasks', createTask);
router.get('/projects/:projectId/tasks', getTasks);

// Direct Task routes
router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);

export default router;
