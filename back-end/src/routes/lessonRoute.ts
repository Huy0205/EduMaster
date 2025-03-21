import { Router } from 'express';
import { LessonController } from '../app/controllers';

const lessonRouter = Router();

// GET http://localhost:8080/api/v1/lesson/list
lessonRouter.get('/list', LessonController.getAllLessons);

// GET http://localhost:8080/api/v1/lesson/grade/:grade
lessonRouter.get('/grade/:grade', LessonController.getLessonsByGrade);

// GET http://localhost:8080/api/v1/lesson/course/:courseId
lessonRouter.get('/course/:courseId', LessonController.getLessonsByCourse);

// GET http://localhost:8080/api/v1/lesson/topic/:topicId
lessonRouter.get('/topic/:topicId', LessonController.getLessonsByTopic);

// GET http://localhost:8080/api/v1/lesson/:lessonId
lessonRouter.get('/:lessonId', LessonController.getLessonById);

// POST: http://localhost:8080/api/v1/lesson/add
lessonRouter.post('/add', LessonController.addLesson);

// PUT: http://localhost:8080/api/v1/lesson/update/:lessonId
lessonRouter.put('/update/:lessonId', LessonController.updateLesson);

export default lessonRouter;
