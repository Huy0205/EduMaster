import { db } from '~/configs';
import { Review } from '~/app/models';

const reviewRepository = db.AppDataSource.getRepository(Review);

export class ReviewService {
    /*
     * Get reviews by topic, order by order ascending
     */
    static async getReviewsByTopic(topicId: string) {
        try {
            const reviews = await reviewRepository.find({
                where: {
                    topic: { id: topicId },
                },
                order: {
                    order: 'ASC',
                },
            });
            return {
                code: 200,
                message: 'Get reviews by topic success',
                data: reviews,
            };
        } catch (error) {
            console.log('Error getting reviews by topic', error);
            throw error;
        }
    }

    /**
     * Get all reviews
     * Oder by topic, if topic duplicate, order by order
     * Paging by 10 items
     * @returns
     */
    static async getAllReviews(page: number, limit: number) {
        try {
            const reviews = await reviewRepository.find({
                order: {
                    topic: {
                        order: 'ASC',
                    },
                    order: 'ASC',
                },
                take: limit,
                skip: (page - 1) * limit,
            });
            return {
                code: 200,
                message: 'Get all reviews success',
                data: reviews,
            };
        } catch (error) {
            console.log('Error getting all reviews', error);
            throw error;
        }
    }

    /**
     * Get review by ID
     * @param reviewId
     * @returns
     */
    static async getReviewById(reviewId: string) {
        try {
            const review = await reviewRepository.findOne({
                where: {
                    id: reviewId,
                },
            });
            return {
                code: 200,
                message: 'Get review success',
                data: review,
            };
        } catch (error) {
            console.log('Error getting review', error);
            throw error;
        }
    }

    /**
     * Get review by Topic
     * @param topicId
     * @returns
     */
    static async countReviewsByTopic(topicId: string) {
        try {
            const count = await reviewRepository.count({
                where: {
                    topic: { id: topicId },
                },
            });
            return {
                code: 200,
                message: 'Count reviews by topic success',
                data: count,
            };
        } catch (error) {
            console.log('Error counting reviews by topic', error);
            throw error;
        }
    }

    /*
     * Set order for review by topic from position to end
     */
    static async setOrderForReviewByTopic(topicId: string, position: number) {
        try {
            const reviews = await reviewRepository.find({
                where: {
                    topic: { id: topicId },
                },
                order: {
                    order: 'ASC',
                },
            });
            for (let i = position; i < reviews.length; i++) {
                reviews[i].order += 1;
                await reviewRepository.save(reviews[i]);
            }
            return {
                code: 200,
                message: 'Set order for review by topic success',
            };
        } catch (error) {
            console.log('Error setting order for review by topic', error);
            throw error;
        }
    }

    static async addReview(review: Partial<Review>) {
        try {
            const newReview = await reviewRepository.save(review);
            return {
                code: 200,
                message: 'Add review success',
                data: newReview,
            };
        } catch (error) {
            console.log('Error adding review', error);
            throw error;
        }
    }
}
