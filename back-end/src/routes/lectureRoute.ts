import { Router } from 'express';
import { LectureController } from '~/app/controllers';

const lectureRouter = Router();

// GET http://localhost:3000/lecture/:reviewId
lectureRouter.get('/:reviewId', LectureController.getLecturesByReview);

export default lectureRouter;
