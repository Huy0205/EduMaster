import { validate as isUUID } from 'uuid';
import { ResponseUtil } from '~/utils';
import { PracticeService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../enums';

export class PracticeController {
    public static async getAllPractices(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PracticeService.getAllPractices();
            ResponseUtil.sendResponse(res, result);
        } catch (error) {
            console.error('Error getting all practices', error);
            next(error);
        }
    }

    public static async getPracticesByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await PracticeService.getPracticesByGrade(Number(grade));
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getPracticesByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await PracticeService.getPracticesByCourse(courseId);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getPracticesByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const result = await PracticeService.getPracticesByTopic(topicId);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getPracticesByLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        if (!lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.STUDENT;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            try {
                const result = await PracticeService.getPracticesByLesson(lessonId, role);
                ResponseUtil.sendResponse(res, result);
            } catch (error) {
                next(error);
            }
        }
    }
}
