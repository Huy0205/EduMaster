import { Router } from 'express';
import { QuizController } from '~/app/controllers';

const quizRouter = Router();

// GET: http://localhost:8080/api/v1/quiz/list
quizRouter.get('/list', QuizController.getAllQuizzes);

// GET: http://localhost:8080/api/v1/quiz/grade/:grade
quizRouter.get('/grade/:grade', QuizController.getQuizByGrade);

// GET: http://localhost:8080/api/v1/quiz/topic/:topicId
quizRouter.get('/topic/:topicId', QuizController.getQuizByTopicId);

// POST: http://localhost:8080/api/v1/quiz/add
quizRouter.post('/add', QuizController.addQuiz);

export default quizRouter;
