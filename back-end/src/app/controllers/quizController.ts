import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { QuizService, TopicService } from '../../app/services';
import { ResponseUtil } from '../../utils';
import { Role, Status } from '../enums';

export class QuizController {
    public static async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await QuizService.getAllQuizzes();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async countAllQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await QuizService.countAllQuizzes();
            ResponseUtil.sendResponse(res, result);
        } catch (error) {
            console.error('Error getting all practices', error);
            next(error);
        }
    }

    public static async getQuizByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuizService.getQuizByGrade(Number(grade));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getQuizByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuizService.getQuizByCourse(courseId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getQuizByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.STUDENT;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            try {
                const response = await QuizService.getQuizByTopic(topicId, role);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getQuizById(req: Request, res: Response, next: NextFunction) {
        const { quizId } = req.params;
        if (!quizId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(quizId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuizService.getQuizById(quizId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async addQuiz(req: Request, res: Response, next: NextFunction) {
        const { name, time, bonusPoint, topicId } = req.body;
        if (!name || time === undefined || !topicId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const topicRes = await TopicService.getTopicById(topicId);
                const orderRes = await QuizService.getMaxOrderInTopic(topicId);
                const response = await QuizService.saveQuiz({
                    name,
                    time,
                    bonusPoint: bonusPoint || 20,
                    orderInTopic: orderRes.data + 1,
                    topic: topicRes.data,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateQuiz(req: Request, res: Response, next: NextFunction) {
        const { quizId } = req.params;
        const { name, time, bonusPoint, status } = req.body;
        if (!quizId || (!name && !time && bonusPoint === undefined && status === undefined)) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(quizId) || (status !== undefined && !(status in Status))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await QuizService.saveQuiz({
                    id: quizId,
                    name,
                    time,
                    bonusPoint,
                    status,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
