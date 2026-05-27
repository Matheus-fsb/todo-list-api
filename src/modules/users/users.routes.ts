import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { userController } = makeControllers();

router.post('/', asyncHandler(userController.create.bind(userController)));
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), asyncHandler(userController.findAll.bind(userController)));
router.get('/me', authMiddleware, asyncHandler(userController.findMe.bind(userController)));
router.get(
  '/deleted',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.findDeleted.bind(userController)),
);
router.patch('/me', authMiddleware, asyncHandler(userController.updateMe.bind(userController)));
router.patch('/me/password', authMiddleware, asyncHandler(userController.updatePassword.bind(userController)));
router.delete('/me', authMiddleware, asyncHandler(userController.deleteMe.bind(userController)));
router.patch('/me/soft-delete', authMiddleware, asyncHandler(userController.softDeleteMe.bind(userController)));
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.findById.bind(userController)),
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.delete.bind(userController)),
);
router.patch('/:id', authMiddleware, asyncHandler(userController.update.bind(userController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(userController.softDelete.bind(userController)));
router.patch(
  '/:id/restore',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.restore.bind(userController)),
);

export default router;
