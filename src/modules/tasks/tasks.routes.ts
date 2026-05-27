import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { taskController } = makeControllers();

router.post('/', authMiddleware, asyncHandler(taskController.create.bind(taskController)));
router.get('/me', authMiddleware, asyncHandler(taskController.findMine.bind(taskController)));
router.get('/overdue', authMiddleware, asyncHandler(taskController.findOverdue.bind(taskController)));
router.get(
  '/projects/:projectId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(taskController.findByProject.bind(taskController)),
);
router.get('/:id', authMiddleware, asyncHandler(taskController.findById.bind(taskController)));
router.put('/:id', authMiddleware, asyncHandler(taskController.update.bind(taskController)));
router.patch('/:id/complete', authMiddleware, asyncHandler(taskController.complete.bind(taskController)));
router.patch('/:id/reopen', authMiddleware, asyncHandler(taskController.reopen.bind(taskController)));
router.delete('/:id', authMiddleware, asyncHandler(taskController.delete.bind(taskController)));
router.patch('/:id', authMiddleware, asyncHandler(taskController.softDelete.bind(taskController)));

export default router;
