import { Router } from 'express';
import { PracticeController } from '~/app/controllers';

const practiceRouter = Router();

// GET: localhost:8080/api/v1/practice/list
practiceRouter.get('/list', PracticeController.getAllPractices);

// GET: localhost:8080/api/v1/practice/lesson/:lessonId
practiceRouter.get('/lesson/:lessonId', PracticeController.getPracticesByLesson);

export default practiceRouter;
