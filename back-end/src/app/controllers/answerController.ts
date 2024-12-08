import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { AnswerService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class AnswerController {
    static async getAnswersByQuestion(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        if (!questionId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(questionId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await AnswerService.getAnswersByQuestion(questionId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting answers by question', error);
                next(error);
            }
        }
    }

    public static async addAnswers(req: Request, res: Response, next: NextFunction) {
        const { answers } = req.body;
        console.log('answers', answers);
        if (!answers || answers.length === 0) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await AnswerService.addAnswers(answers);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error adding answers', error);
                next(error);
            }
        }
    }
}
