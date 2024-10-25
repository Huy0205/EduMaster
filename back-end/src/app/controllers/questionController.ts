import { NextFunction, Request, Response } from 'express';
import { QuestionService, ReviewService } from '~/app/services';
import { Question } from '~/app/models';

export class QuestionController {
    static async getQuestionsByReview(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;

        if (!reviewId) {
            res.status(400).json({
                code: 400,
                message: 'Review ID is required',
            });
        } else {
            try {
                const questions = await QuestionService.getQuestionsByReview(reviewId);
                res.status(questions.code).json(questions);
            } catch (error) {
                console.log('Error getting questions by review', error);
                next(error);
            }
        }
    }

    static async addQuestion(req: Request, res: Response, next: NextFunction) {
        // type is number in enum/questionType file
        // reviewId can be null in case of adding a question within a quiz
        const { content, type, reviewId } = req.body;
        let { order } = req.body;

        if (!content || !type) {
            res.status(400).json({
                code: 400,
                message: 'Content and type are required',
            });
        } else {
            try {
                let reviewRes = null;
                if (reviewId) {
                    if (order) {
                        // If there is an order, move the old questions back
                        await QuestionService.setOrderForQuestionByReview(reviewId, order);
                    } else {
                        // If there is no order, get the current number of questions and increase the order by 1
                        const resTotalQuestions = await QuestionService.countQuestionsByReview(
                            reviewId,
                        );
                        order = resTotalQuestions.data + 1;
                    }
                    reviewRes = await ReviewService.getReviewById(reviewId);
                }
                const question: Partial<Question> = {
                    content,
                    type,
                    order,
                    review: reviewRes?.data,
                };
                const newQuestion = await QuestionService.addQuestion(question);
                res.status(newQuestion.code).json(newQuestion);
            } catch (error) {
                console.log('Error adding question', error);
                next(error);
            }
        }
    }
}
