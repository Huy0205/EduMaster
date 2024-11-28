import { NextFunction, Request, Response } from 'express';
import { QuizService, TopicService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class QuizController {
    public static async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await QuizService.getAllQuizzes(pageNum, limitNum);
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async getQuizByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        const { page, limit } = req.query;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await QuizService.getQuizByGrade(Number(grade), pageNum, limitNum);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async addQuiz(req: Request, res: Response, next: NextFunction) {
        const { name, time, bonusPoint, topicId } = req.body;
        if (!name || !time || !topicId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const topicRes = await TopicService.getTopicById(topicId);
                const response = await QuizService.addQuiz({
                    name,
                    time,
                    bonusPoint: bonusPoint || 20,
                    topic: topicRes.data,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getQuizByTopicId(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await QuizService.getQuizByTopicId(topicId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
