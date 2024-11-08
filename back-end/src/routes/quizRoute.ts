import { Router } from 'express';
import { QuizController } from '~/app/controllers';

const quizRouter = Router();

// GET: http://localhost:8080/api/v1/quiz/topic/:topicId
quizRouter.get('/topic/:topicId', QuizController.getQuizByTopicId);

// POST: http://localhost:8080/api/v1/quiz/add
quizRouter.post('/add', QuizController.addQuiz);

export default quizRouter;
