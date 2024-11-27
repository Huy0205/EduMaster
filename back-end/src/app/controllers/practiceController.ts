import { validate as isUUID } from 'uuid';
import { ResponseUtil } from '~/utils';
import { PracticeService } from '../services';
import { NextFunction, Request, Response } from 'express';

export class PracticeController {
    public static async getAllPractices(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const result = await PracticeService.getAllPractices(pageNum, limitNum);
            ResponseUtil.sendResponse(res, result);
        } catch (error) {
            console.error('Error getting all practices', error);
            next(error);
        }
    }

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
