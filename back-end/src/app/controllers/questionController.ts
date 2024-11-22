import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { LessonService, QuestionService } from '~/app/services';
import { Question } from '~/app/models';
import { ResponseUtil } from '~/utils';

export class QuestionController {
    public static async getAllQuestions(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await QuestionService.getAllQuestions(pageNum, limitNum);
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            console.log('Error getting all questions', error);
            next(error);
        }
    }

    public static async getQuestionsByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuestionService.getQuestionsByGrade(
                    Number(grade),
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by grade', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuestionService.getQuestionsByCourse(
                    courseId,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by course', error);
                next(error);
            }
        }
    }

    public static async getQuestionsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuestionService.getQuestionsByTopic(
                    topicId,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting questions by topic', error);
                next(error);
            }
        }
    }

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
                const response = await QuestionService.getQuestionsByLesson(
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
        const { content, image, type, lessonId } = req.body;
        let { orderInLesson } = req.body;

        if (!content || !type) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                let lessonRes = null;
                if (lessonId) {
                    if (orderInLesson) {
                        // If there is an order, move the old questions back
                        await QuestionService.setOrderForQuestionByLesson(lessonId, orderInLesson);
                    } else {
                        // If there is no order, get the current number of questions and increase the order by 1
                        const resTotalQuestions = await QuestionService.countQuestionsByLesson(
                            lessonId,
                        );
                        orderInLesson = resTotalQuestions.data + 1;
                    }
                    lessonRes = await LessonService.getLessonById(lessonId);
                }
                const question: Partial<Question> = {
                    content,
                    image,
                    type,
                    orderInLesson,
                    lesson: lessonRes?.data,
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
