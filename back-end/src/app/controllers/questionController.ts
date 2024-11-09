import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { QuestionService, ReviewService } from '~/app/services';
import { Question } from '~/app/models';
import { ResponseUtil } from '~/utils';

export class QuestionController {
    static async getQuestionsByReview(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;
        const { page, limit } = req.query;

        if (!reviewId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(reviewId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const pageNum = Number(page) > 0 ? Number(page) : 1;
                const limitNum = Number(limit) > 0 ? Number(limit) : 10;
                const response = await QuestionService.getQuestionsByReview(
                    reviewId,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by review', error);
                next(error);
            }
        }
    }

    static async getQuestionsByQuiz(req: Request, res: Response, next: NextFunction) {
        const { quizId } = req.params;

        if (!quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuestionService.getQuestionsByQuiz(quizId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by quiz', error);
                next(error);
            }
        }
    }

    static async addQuestion(req: Request, res: Response, next: NextFunction) {
        // type is number in enum/questionType file
        // reviewId can be null in case of adding a question within a quiz
        const { content, image, type, reviewId } = req.body;
        let { order } = req.body;

        if (!content || !type) {
            ResponseUtil.sendMissingData(res);
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
                    image,
                    type,
                    order,
                    review: reviewRes?.data,
                };
                const response = await QuestionService.addQuestion(question);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error adding question', error);
                next(error);
            }
        }
    }
}
