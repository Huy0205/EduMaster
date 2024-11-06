import { db } from '~/configs';
import { Question } from '~/app/models';

const questionRepository = db.AppDataSource.getRepository(Question);

export class QuestionService {
    /*
     * Get questions by review, order by order ascending
     */
    static async getQuestionsByReview(reviewId: string, page: number, limit: number) {
        try {
            const [questions, total] = await questionRepository.findAndCount({
                where: {
                    review: { id: reviewId },
                },
                order: {
                    order: 'ASC',
                },
                take: limit,
                skip: (page - 1) * limit,
            });

            const totalPages = Math.ceil(total / limit);
            return {
                code: 200,
                message: 'Get questions by review success',
                data: {
                    totalPages,
                    currentPage: page,
                    questions,
                },
            };
        } catch (error) {
            console.log('Error getting questions by review', error);
            throw error;
        }
    }

    /*
     * Set order for question by review from position to end
     */
    static async setOrderForQuestionByReview(reviewId: string, position: number) {
        try {
            const questions = await questionRepository.find({
                where: {
                    review: { id: reviewId },
                },
                order: {
                    order: 'ASC',
                },
            });
            questions.forEach(async (question) => {
                if (question.order >= position) {
                    question.order += 1;
                    await questionRepository.save(question);
                }
            });
        } catch (error) {
            console.log('Error setting order for question by review', error);
            throw error;
        }
    }

    /**
     * Count questions by review
     */
    static async countQuestionsByReview(reviewId: string) {
        try {
            const count = await questionRepository.count({
                where: {
                    review: { id: reviewId },
                },
            });
            return {
                code: 200,
                message: 'Count questions by review success',
                data: count,
            };
        } catch (error) {
            console.log('Error counting questions by review', error);
            throw error;
        }
    }

    /*
     * Add question
     */
    static async addQuestion(question: Partial<Question>) {
        try {
            const newQuestion = await questionRepository.save(question);
            return {
                code: 200,
                message: 'Add question success',
                data: newQuestion,
            };
        } catch (error) {
            console.log('Error adding question', error);
            throw error;
        }
    }
}
