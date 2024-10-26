import { NextFunction, Request, Response } from 'express';
import { ReviewService, TopicService } from '~/app/services';
import { Review } from '../models';

export class ReviewController {
    static async getReviewsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;

        if (!topicId) {
            res.status(400).json({
                code: 400,
                message: 'Topic ID is required',
            });
        } else {
            try {
                const reviews = await ReviewService.getReviewsByTopic(topicId);
                res.status(reviews.code).json(reviews);
            } catch (error) {
                console.log('Error getting reviews by topic', error);
                next(error);
            }
        }
    }

    static async getAllReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await ReviewService.getAllReviews();
            res.status(reviews.code).json(reviews);
        } catch (error) {
            console.log('Error getting all reviews', error);
            next(error);
        }
    }

    static async addReview(req: Request, res: Response, next: NextFunction) {
        const { name, bonusPoint, topicId } = req.body;
        let { order } = req.body;

        if (!name || !topicId) {
            res.status(400).json({
                code: 400,
                message: 'Name and topic ID are required',
            });
        } else {
            try {
                if (order) {
                    // Nếu có order thì lùi các review cũ ra sau
                    await ReviewService.setOrderForReviewByTopic(topicId, order);
                } else {
                    // Nếu không có order thì lấy số lượng review hiện tại và tăng thứ tự lên 1
                    const resTotalReviews = await ReviewService.countReviewsByTopic(topicId);
                    order = resTotalReviews.data + 1;
                }
                const resTopic = await TopicService.getTopicById(topicId);
                const review: Partial<Review> = {
                    name,
                    order: order,
                    bonusPoint: bonusPoint || 10,
                    topic: resTopic.data,
                };
                const newReview = await ReviewService.addReview(review);
                res.status(newReview.code).json(newReview);
            } catch (error) {
                console.log('Error adding review', error);
                next(error);
            }
        }
    }
}
