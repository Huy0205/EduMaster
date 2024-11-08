import { NextFunction, Request, Response } from 'express';
import { QuizService, TopicService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class QuizController {
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
