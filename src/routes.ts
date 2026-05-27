import { Router } from 'express';
import userRoutes from './modules/users/users.routes.js';
import projectRoutes from './modules/projects/projects.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import validationTokenRoutes from './modules/validation-token/validation-token.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);
router.use('/auth', validationTokenRoutes);

export default router;
