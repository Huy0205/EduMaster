import { NextFunction, Request, Response } from 'express';
import { ReviewService, TopicService } from '~/app/services';
import { Review } from '../models';
import { responseUtil } from '~/utils';

export class ReviewController {
    static async getReviewsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;

        if (!topicId) {
            responseUtil.sendResponse(res, {
                code: 400,
                message: 'Topic ID is required',
            });
        } else {
            try {
                const response = await ReviewService.getReviewsByTopic(topicId);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting reviews by topic', error);
                next(error);
            }
        }
    }

    static async getAllReviews(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;

        try {
            const pageNum = Number(page) > 0 ? Number(page) : 1; // Gán 1 nếu page không hợp lệ
            const limitNum = Number(limit) > 0 ? Number(limit) : 10; // Gán 10 nếu limit không hợp lệ
            const response = await ReviewService.getAllReviews(pageNum, limitNum);
            responseUtil.sendResponse(res, response);
        } catch (error) {
            console.log('Error getting all reviews', error);
            next(error);
        }
    }

    static async addReview(req: Request, res: Response, next: NextFunction) {
        const { name, bonusPoint, topicId } = req.body;
        let { order } = req.body;

        if (!name || !topicId) {
            responseUtil.sendResponse(res, {
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
                const response = await ReviewService.addReview(review);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error adding review', error);
                next(error);
            }
        }
    }
}
