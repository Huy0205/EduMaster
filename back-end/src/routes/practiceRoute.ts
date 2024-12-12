import { Router } from 'express';
import { PracticeController } from '../app/controllers';

const practiceRouter = Router();

// GET: localhost:8080/api/v1/practice/list
practiceRouter.get('/list', PracticeController.getAllPractices);

// GET: localhost:8080/api/v1/practice/grade/:grade
practiceRouter.get('/grade/:grade', PracticeController.getPracticesByGrade);

// GET: localhost:8080/api/v1/practice/course/:courseId
practiceRouter.get('/course/:courseId', PracticeController.getPracticesByCourse);

// GET: localhost:8080/api/v1/practice/topic/:topicId
practiceRouter.get('/topic/:topicId', PracticeController.getPracticesByTopic);

// GET: localhost:8080/api/v1/practice/lesson/:lessonId
practiceRouter.get('/lesson/:lessonId', PracticeController.getPracticesByLesson);

// POST: localhost:8080/api/v1/practice/add
practiceRouter.post('/add', PracticeController.addPractice);

// PUT: localhost:8080/api/v1/practice/update/:practiceId
practiceRouter.put('/update/:practiceId', PracticeController.updatePractice);

export default practiceRouter;
