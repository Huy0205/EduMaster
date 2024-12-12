import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { EnrollmentService } from '../services';
import { ResponseUtil } from '../../utils';

export class EnrollmentController {
    public static async addEnrollment(req: Request, res: Response, next: NextFunction) {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const enrollment = await EnrollmentService.addEnrollment(userId, courseId);
                ResponseUtil.sendResponse(res, enrollment);
            } catch (error) {
                next(error);
            }
        }
    }
}
