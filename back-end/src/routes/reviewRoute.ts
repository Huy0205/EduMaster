import { Router } from 'express';
import { ReviewController } from '~/app/controllers';

const reviewRouter = Router();

// GET http://localhost:3000/review/:topicId
reviewRouter.get('/:topicId', ReviewController.getReviewsByTopic);

// GET http://localhost:3000/review/list
reviewRouter.get('/list', ReviewController.getAllReviews);

// POST http://localhost:3000/review/add
reviewRouter.post('/add', ReviewController.addReview);

export default reviewRouter;
