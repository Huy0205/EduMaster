import { ResponseUtil } from '../../utils';
import { validate as isUUID } from 'uuid';
import { LessonService, TopicService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { Role, Status } from '../enums';

export class LessonController {
    public static async getAllLessons(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await LessonService.getAllLessons();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async getLessonsByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LessonService.getLessonsByGrade(Number(grade));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getLessonsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LessonService.getLessonsByCourse(courseId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getLessonsByTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        if (!topicId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.STUDENT;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            try {
                const response = await LessonService.getLessonsByTopic(topicId, role);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getLessonById(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        if (!lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LessonService.getLessonById(lessonId);
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
                const response = await LessonService.saveLesson({
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

    public static async updateLesson(req: Request, res: Response, next: NextFunction) {
        const { lessonId } = req.params;
        const { lessonName, status } = req.body;

        if (!lessonId || (!lessonName && status === undefined)) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId) || (status !== undefined && !(status in Status))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LessonService.saveLesson({
                    id: lessonId,
                    name: lessonName,
                    status,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
