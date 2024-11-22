import { ResponseUtil } from '~/utils';
import { validate as isUUID } from 'uuid';
import { LessonService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../enums';

export class LessonController {
    public static async getAllLessons(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await LessonService.getAllLessons(pageNum, limitNum);
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async getLessonsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        const { page, limit } = req.query;

        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.ADMIN;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await LessonService.getLessonsByTopic(
                    topicId,
                    role,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getLessonsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        const { page, limit } = req.query;

        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await LessonService.getLessonsByCourse(
                    courseId,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getLessonsByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        const { page, limit } = req.query;

        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await LessonService.getLessonsByGrade(
                    Number(grade),
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
