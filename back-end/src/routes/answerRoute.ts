import { Router } from 'express';
import { AnswerController } from '../app/controllers';

const answerRouter = Router();

// GET http://localhost:8080/answer/question/:questionId
answerRouter.get('/question/:questionId', AnswerController.getAnswersByQuestion);

// POST http://localhost:8080/answer/add-multiple
answerRouter.post('/add-multiple', AnswerController.addAnswers);

export default answerRouter;
