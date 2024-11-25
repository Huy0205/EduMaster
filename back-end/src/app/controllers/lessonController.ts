import { ResponseUtil } from '~/utils';
import { validate as isUUID } from 'uuid';
import { LessonService, TopicService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { Role, Status } from '../enums';

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

    public static async addLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonName, topicId } = req.body;
        console.log(lessonName, topicId);
        if (!lessonName || !topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const maxOrderRes = await LessonService.getMaxOrderInTopic(topicId);
                const topicRes = await TopicService.getTopicById(topicId);
                const response = await LessonService.addLesson({
                    name: lessonName,
                    orderInTopic: maxOrderRes.data + 1,
                    topic: topicRes.data,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateStatus(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        const { status } = req.body;

        if (!lessonId || status === undefined) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId) || !(status in Status)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LessonService.updateStatus(lessonId, Number(status));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
