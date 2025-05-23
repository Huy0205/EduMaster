import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { ResponseUtil } from '../../utils';
import { PracticeProgressService } from '../services';

export class PracticeProgressController {
    public static async getPracticeProgressByUserAndPractice(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { userId, practiceId } = req.params;
        if (!userId || !practiceId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(practiceId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const practiceProgress =
                    await PracticeProgressService.getPracticeProgressByUserAndPractice(
                        userId as string,
                        practiceId as string,
                    );
                ResponseUtil.sendResponse(res, practiceProgress);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async addPracticeProgress(req: Request, res: Response, next: NextFunction) {
        const { userId, practiceId, lastQuestionIndex } = req.body;
        if (!userId || !practiceId || lastQuestionIndex === undefined) {
            ResponseUtil.sendMissingData(res);
        } else if (
            !isUUID(userId) ||
            !isUUID(practiceId) ||
            typeof lastQuestionIndex !== 'number'
        ) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const newPracticeProgress = await PracticeProgressService.addPracticeProgress({
                    userId,
                    practiceId,
                    lastQuestionIndex,
                });
                ResponseUtil.sendResponse(res, newPracticeProgress);
            } catch (error) {
                next(error);
            }
        }
    }
}
