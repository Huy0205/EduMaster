import { Router } from 'express';
import { TheoryController } from '~/app/controllers';

const theoryRouter = Router();

// GET http://localhost:8080/api/v1/theory/list
theoryRouter.get('/list', TheoryController.getAllTheories);

// GET http://localhost:8080/api/v1/theory/grade/:grade
theoryRouter.get('/grade/:grade', TheoryController.getTheoriesByGrade);

// GET http://localhost:8080/api/v1/theory/course/:courseId
theoryRouter.get('/course/:courseId', TheoryController.getTheoriesByCourse);

// GET http://localhost:8080/api/v1/theory/topic/:topicId
theoryRouter.get('/topic/:topicId', TheoryController.getTheoriesByTopic);

// GET http://localhost:8080/api/v1/theory/lesson/:lessonId
theoryRouter.get('/lesson/:lessonId', TheoryController.getTheoriesByLesson);

export default theoryRouter;
