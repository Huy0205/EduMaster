import { Router } from 'express';
import { QuizController } from '~/app/controllers';

const quizRouter = Router();

// POST: http://localhost:3000/quiz/add
quizRouter.post('/add', QuizController.addQuiz);

export default quizRouter;
