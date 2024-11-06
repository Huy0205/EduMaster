import { Router } from 'express';
import { LectureController } from '~/app/controllers';

const lectureRouter = Router();

// GET http://localhost:8080/api/v1/lecture/review/:reviewId
lectureRouter.get('/review/:reviewId', LectureController.getLecturesByReview);

export default lectureRouter;
