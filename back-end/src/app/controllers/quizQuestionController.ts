import { NextFunction, Request, Response } from 'express';

import { ResponseUtil } from '~/utils';
import { QuizQuestionService } from '~/app/services';

export class QuizQuestionController {
    public static async addQuizQuestions(req: Request, res: Response, next: NextFunction) {
        const { quizQuestions } = req.body;
        if (!quizQuestions || quizQuestions.length === 0) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const result = await QuizQuestionService.saveQuizQuestions(quizQuestions);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }
}
