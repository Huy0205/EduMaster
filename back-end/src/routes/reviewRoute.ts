import { Router } from 'express';
import { ReviewController } from '~/app/controllers';

const reviewRouter = Router();

// GET http://localhost:8080/api/v1/review/topic/:topicId
reviewRouter.get('/topic/:topicId', ReviewController.getReviewsByTopic);

// GET http://localhost:8080/api/v1/review/list
reviewRouter.get('/list', ReviewController.getAllReviews);

// POST http://localhost:8080/api/v1/review/add
reviewRouter.post('/add', ReviewController.addReview);

export default reviewRouter;
