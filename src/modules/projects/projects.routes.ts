import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { projectController } = makeControllers();

router.post('/', asyncHandler(projectController.create.bind(projectController)));
router.get(
  '/users/:userId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(projectController.findByUser.bind(projectController)),
);
router.patch('/:id', authMiddleware, asyncHandler(projectController.update.bind(projectController)));
router.delete('/:id', authMiddleware, asyncHandler(projectController.delete.bind(projectController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(projectController.softDelete.bind(projectController)));

export default router;
