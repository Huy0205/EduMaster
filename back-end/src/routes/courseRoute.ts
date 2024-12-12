import { Router } from 'express';
import { CourseController } from '../app/controllers';
import { authentication } from '../middlewares';

const courseRouter = Router();

// GET: localhost:8080/api/v1/course/list
courseRouter.get('/list', authentication, CourseController.getAllCourses);

// GET: localhost:8080/api/v1/course/grade-distinct
courseRouter.get('/grade-distinct', CourseController.getGradeDistinct);

// GET: localhost:8080/api/v1/course/grade/:grade
courseRouter.get('/grade/:grade', CourseController.getCoursesByGrade);

// GET: localhost:8080/api/v1/course/:courseId
courseRouter.get('/:courseId', CourseController.getCourseById);

export default courseRouter;
