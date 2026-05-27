import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { taskController } = makeControllers();

router.post('/', asyncHandler(taskController.create.bind(taskController)));
router.put('/:id', authMiddleware, asyncHandler(taskController.update.bind(taskController)));
router.get(
  '/projects/:projectId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(taskController.findByProject.bind(taskController)),
);
router.delete('/:id', authMiddleware, asyncHandler(taskController.delete.bind(taskController)));
router.patch('/:id', authMiddleware, asyncHandler(taskController.softDelete.bind(taskController)));

export default router;
