import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { TheoryService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class TheoryController {
    public static async getAllTheories(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await TheoryService.getAllTheories(pageNum, limitNum);
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            console.log('Error getting all theories', error);
            next(error);
        }
    }

    public static async getTheoriesByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await TheoryService.getTheoriesByGrade(
                    Number(grade),
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting theories by grade', error);
                next(error);
            }
        }
    }

    public static async getTheoriesByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await TheoryService.getTheoriesByCourse(
                    courseId,
                    pageNum,
                    limitNum,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting theories by course', error);
                next(error);
            }
        }
    }

    public static async getTheoriesByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;

            try {
                const response = await TheoryService.getTheoriesByTopic(topicId, pageNum, limitNum);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting theories by topic', error);
                next(error);
            }
        }
    }

    public static async getTheoriesByLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        if (!lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TheoryService.getTheoriesByLesson(lessonId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting theories by lesson', error);
                next(error);
            }
        }
    }
}
