import { NextFunction, Request, Response } from 'express';
import { AnswerService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class AnswerController {
    static async getAnswersByQuestion(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        if (!questionId) {
            ResponseUtil.sendMissingData(res);
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
}
