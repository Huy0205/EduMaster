import { validate as isUUID } from 'uuid';
import { ResponseUtil } from '~/utils';
import { PracticeService } from '../services';
import { NextFunction, Request, Response } from 'express';

export class PracticeController {
    public static async getPracticesByLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        if (!lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await PracticeService.getPracticesByLesson(lessonId);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }
}
