import { Router } from 'express';
import { QuizQuestionController } from '../app/controllers';

const quizQuestionRouter = Router();

// POST: http://localhost:8080/api/v1/quiz-question/add-multiple
quizQuestionRouter.post('/add-multiple', QuizQuestionController.addQuizQuestions);

export default quizQuestionRouter;
