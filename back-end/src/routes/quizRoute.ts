import { Router } from 'express';
import { QuizController } from '../app/controllers';

const quizRouter = Router();

// GET: http://localhost:8080/api/v1/quiz/list
quizRouter.get('/list', QuizController.getAllQuizzes);

// GET: http://localhost:8080/api/v1/quiz/count
quizRouter.get('/count', QuizController.countAllQuizzes);

// GET: http://localhost:8080/api/v1/quiz/grade/:grade
quizRouter.get('/grade/:grade', QuizController.getQuizByGrade);

// GET: http://localhost:8080/api/v1/quiz/course/:courseId
quizRouter.get('/course/:courseId', QuizController.getQuizByCourse);

// GET: http://localhost:8080/api/v1/quiz/topic/:topicId
quizRouter.get('/topic/:topicId', QuizController.getQuizByTopic);

// GET: http://localhost:8080/api/v1/quiz/:quizId
quizRouter.get('/:quizId', QuizController.getQuizById);

// POST: http://localhost:8080/api/v1/quiz/add
quizRouter.post('/add', QuizController.addQuiz);

// PUT: http://localhost:8080/api/v1/quiz/update/:quizId
quizRouter.put('/update/:quizId', QuizController.updateQuiz);

export default quizRouter;
