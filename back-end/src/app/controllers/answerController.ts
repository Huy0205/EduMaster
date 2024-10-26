import { NextFunction, Request, Response } from 'express';
import { AnswerService } from '~/app/services';

export class AnswerController {
    static async getAnswersByQuestion(req: Request, res: Response, next: NextFunction) {
        const { questionId } = req.params;
        if (!questionId) {
            res.status(400).json({
                code: 400,
                message: 'Question ID is required',
            });
        } else {
            try {
                const response = await AnswerService.getAnswersByQuestion(questionId);
                res.status(response.code).json(response);
            } catch (error) {
                console.log('Error getting answers by question', error);
                next(error);
            }
        }
    }
}
