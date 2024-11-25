import { Router } from 'express';
import { QuestionController } from '~/app/controllers';

const questionRouter = Router();

// GET: localhost:8080/api/v1/question/list
questionRouter.get('/list', QuestionController.getAllQuestions);

// GET: localhost:8080/api/v1/question/grade/:grade
questionRouter.get('/grade/:grade', QuestionController.getQuestionsByGrade);

// GET: localhost:8080/api/v1/question/course/:courseId
questionRouter.get('/course/:courseId', QuestionController.getQuestionsByCourse);

// GET: localhost:8080/api/v1/question/topic/:topicId
questionRouter.get('/topic/:topicId', QuestionController.getQuestionsByTopic);

// GET: localhost:8080/api/v1/question/review/:reviewId
questionRouter.get('/review/:reviewId', QuestionController.getQuestionsByReview);

// GET: localhost:8080/api/v1/question/quiz/:quizId
questionRouter.get('/quiz/:quizId', QuestionController.getQuestionsByQuiz);

export default questionRouter;
