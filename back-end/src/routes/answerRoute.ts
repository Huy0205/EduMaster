import { Router } from 'express';
import { AnswerController } from '~/app/controllers';

const answerRouter = Router();

// GET http://localhost:3000/answer/:questionId
answerRouter.get('/:questionId', AnswerController.getAnswersByQuestion);

export default answerRouter;
