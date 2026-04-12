import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  getProjectStats
} from '../controllers/project.controller';

const router = Router();

router.use(requireAuth); // Protect all project routes natively

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id/stats', getProjectStats);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
