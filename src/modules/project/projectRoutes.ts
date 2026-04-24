import { Router } from 'express';
import { ProjectController } from './projectController.js';

const router = Router();
const controller = new ProjectController();

router.post('/', controller.create.bind(controller));
router.get('/user/:userId', controller.findByUser.bind(controller));

export default router;
