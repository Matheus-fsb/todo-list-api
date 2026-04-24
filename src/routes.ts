import { Router } from 'express';
import userRoutes from './modules/user/userRoutes.js';
import projectRoutes from './modules/project/projectRoutes.js';
import taskRoutes from './modules/task/taskRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
