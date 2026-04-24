import { Router } from 'express';
import { UserController } from './userController.js';

const router = Router();
const controller = new UserController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));

export default router;
