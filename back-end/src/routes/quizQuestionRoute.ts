import { Router } from 'express';
import { QuizQuestionController } from '~/app/controllers';
import { authentication } from '~/middlewares';

const quizQuestionRouter = Router();



// POST: http://localhost:8080/api/v1/quiz-question/add
quizQuestionRouter.post('/add', authentication, QuizQuestionController.addQuizQuestion);

export default quizQuestionRouter;
