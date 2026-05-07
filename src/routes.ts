import { Router } from 'express';
import userRoutes from './modules/users/users.routes.js';
import projectRoutes from './modules/projects/projects.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
