import { Router } from 'express';
import { EnrollmentController } from '../app/controllers';

const enrollmentRouter = Router();

// POST: localhost:8080/api/v1/enrollment/add
enrollmentRouter.post('/add', EnrollmentController.addEnrollment);

export default enrollmentRouter;
