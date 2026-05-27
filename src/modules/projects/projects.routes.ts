import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { projectController } = makeControllers();

router.post('/', authMiddleware, asyncHandler(projectController.create.bind(projectController)));
router.get('/me', authMiddleware, asyncHandler(projectController.findMine.bind(projectController)));
router.get('/deleted', authMiddleware, asyncHandler(projectController.findDeleted.bind(projectController)));
router.get(
  '/users/:userId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(projectController.findByUser.bind(projectController)),
);
router.get('/:id/tasks', authMiddleware, asyncHandler(projectController.findTasks.bind(projectController)));
router.get('/:id', authMiddleware, asyncHandler(projectController.findById.bind(projectController)));
router.patch('/:id', authMiddleware, asyncHandler(projectController.update.bind(projectController)));
router.delete('/:id', authMiddleware, asyncHandler(projectController.delete.bind(projectController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(projectController.softDelete.bind(projectController)));
router.patch('/:id/restore', authMiddleware, asyncHandler(projectController.restore.bind(projectController)));

export default router;
