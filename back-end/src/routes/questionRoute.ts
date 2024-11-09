import { Router } from 'express';
import { QuestionController } from '~/app/controllers';

const questionRouter = Router();

// GET: localhost:8080/api/v1/question/review/:reviewId
questionRouter.get('/review/:reviewId', QuestionController.getQuestionsByReview);

// GET: localhost:8080/api/v1/question/quiz/:quizId
questionRouter.get('/quiz/:quizId', QuestionController.getQuestionsByQuiz);

// POST: localhost:8080/api/v1/question/add
questionRouter.post('/add', QuestionController.addQuestion);

export default questionRouter;
