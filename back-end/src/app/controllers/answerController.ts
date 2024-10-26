import { NextFunction, Request, Response } from 'express';
import { AnswerService } from '~/app/services';
import { responseUtil } from '~/utils';

export class AnswerController {
    static async getAnswersByQuestion(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        if (!questionId) {
            responseUtil.sendResponse(res, {
                code: 400,
                message: 'Question ID is required',
            });
        } else {
            try {
                const response = await AnswerService.getAnswersByQuestion(questionId);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting answers by question', error);
                next(error);
            }
        }
    }
}
