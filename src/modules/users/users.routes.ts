import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { userController } = makeControllers();

router.post('/', asyncHandler(userController.create.bind(userController)));
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), asyncHandler(userController.findAll.bind(userController)));
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.findById.bind(userController)),
);
router.delete('/:id', authMiddleware, asyncHandler(userController.delete.bind(userController)));
router.patch('/:id', authMiddleware, asyncHandler(userController.update.bind(userController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(userController.softDelete.bind(userController)));

export default router;
