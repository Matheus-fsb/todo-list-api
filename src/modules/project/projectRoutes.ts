import { Router } from 'express';
import { makeProjectController } from './projectFactory.js';

const router = Router();
const controller = makeProjectController();

router.post('/', controller.create.bind(controller));
router.get('/user/:userId', controller.findByUser.bind(controller));

export default router;
