import { Router } from 'express';
import { PracticeProgressController } from '../app/controllers';

const practiceProgressRouter = Router();

// GET: http://localhost:8080/api/v1/practice-progress/user/:userId/practice/:practiceId
practiceProgressRouter.get(
    '/user/:userId/practice/:practiceId',
    PracticeProgressController.getPracticeProgressByUserAndPractice,
);

// POST: http://localhost:8080/api/v1/practice-progress/add
practiceProgressRouter.post('/add', PracticeProgressController.addPracticeProgress);

export default practiceProgressRouter;
