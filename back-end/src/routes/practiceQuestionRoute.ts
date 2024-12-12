import { Router } from 'express';
import { PracticeQuestionController } from '../app/controllers';

const practiceQuestionRouter = Router();

// POST: http://localhost:3000/api/practice-question/add-multiple
practiceQuestionRouter.post('/add-multiple', PracticeQuestionController.addPracticeQuestions);

export default practiceQuestionRouter;
