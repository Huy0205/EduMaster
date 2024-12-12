import { NextFunction, Request, Response } from 'express';
import { ResponseUtil } from '../../utils';
import { PracticeQuestionService } from '../services/practiceQuestionService';

export class PracticeQuestionController {
    public static async addPracticeQuestions(req: Request, res: Response, next: NextFunction) {
        const { practiceQuestions } = req.body;
        console.log(practiceQuestions);
        if (!practiceQuestions || practiceQuestions.length === 0) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const result = await PracticeQuestionService.savePracticeQuestions(
                    practiceQuestions,
                );
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }
}
