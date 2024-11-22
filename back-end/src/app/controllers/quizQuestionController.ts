import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';

import { ResponseUtil } from '~/utils';
import { QuizQuestionService } from '~/app/services';

export class QuizQuestionController {
    static async addQuizQuestion(req: Request, res: Response, next: NextFunction) {
        const { quizId, questionId } = req.body;

        if (!quizId || !questionId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(quizId) || !isUUID(questionId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const quizQuestionRes = await QuizQuestionService.addQuizQuestion(
                    quizId,
                    questionId,
                );
                ResponseUtil.sendResponse(res, quizQuestionRes);
            } catch (error) {
                next(error);
            }
        }
    }
}
