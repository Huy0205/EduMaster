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

// GET: localhost:8080/api/v1/question/lesson/:lessonId
questionRouter.get('/lesson/:lessonId', QuestionController.getQuestionsByLesson);

// GET: localhost:8080/api/v1/question/quiz/:quizId
questionRouter.get('/quiz/:quizId', QuestionController.getQuestionsByQuiz);

// POST: localhost:8080/api/v1/question/add
questionRouter.post('/add', QuestionController.addQuestion);

export default questionRouter;
