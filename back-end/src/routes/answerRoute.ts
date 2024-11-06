import { Router } from 'express';
import { AnswerController } from '~/app/controllers';

const answerRouter = Router();

// GET http://localhost:8080/answer/question/:questionId
answerRouter.get('/question/:questionId', AnswerController.getAnswersByQuestion);

export default answerRouter;
