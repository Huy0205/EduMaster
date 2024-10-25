import { Router } from 'express';
import { ReviewController } from '~/app/controllers';

const reviewRouter = Router();

reviewRouter.get('/:topicId', ReviewController.getReviewsByTopic);

reviewRouter.post('/add', ReviewController.addReview);

export default reviewRouter;
