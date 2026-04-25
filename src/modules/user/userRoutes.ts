import { Router } from 'express';
import { makeUserController } from './userFactory.js';

const router = Router();
const controller = makeUserController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));

export default router;
