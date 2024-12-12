import { Router } from 'express';
import { EnrollmentController } from '../app/controllers';
import { authentication } from '../middlewares';

const enrollmentRouter = Router();

// POST: localhost:8080/api/v1/enrollment/add
enrollmentRouter.post('/add', authentication, EnrollmentController.addEnrollment);

export default enrollmentRouter;
