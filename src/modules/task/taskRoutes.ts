import { Router } from 'express';
import { makeTaskController } from './taskFactory.js';

const router = Router();
const controller = makeTaskController();

router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.get('/project/:projectId', controller.findByProject.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
