import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { LessonService, TheoryService } from  '../../app/services';
import { ResponseUtil } from '../../utils';
import { Role, Status } from '../enums';

export class TheoryController {
    public static async getAllTheories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TheoryService.getAllTheories();
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
            try {
                const response = await TheoryService.getTheoriesByGrade(Number(grade));
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
            try {
                const response = await TheoryService.getTheoriesByCourse(courseId);
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
            try {
                const response = await TheoryService.getTheoriesByTopic(topicId);
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
                let role = Role.STUDENT;
                if (Number(req.headers['role']) in Role) {
                    role = Number(req.headers['role']);
                }
                const response = await TheoryService.getTheoriesByLesson(lessonId, role);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting theories by lesson', error);
                next(error);
            }
        }
    }

    public static async addTheory(req: Request, res: Response, next: NextFunction) {
        const { title, url, description, lessonId } = req.body;
        if (!title || !url || !lessonId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(lessonId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const maxOrderRes = await TheoryService.getMaxOrderInLesson(lessonId);
                const lessonRes = await LessonService.getLessonById(lessonId);
                const response = await TheoryService.saveTheory({
                    title,
                    url,
                    description,
                    lesson: lessonRes.data,
                    orderInLesson: maxOrderRes.data + 1,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateTheory(req: Request, res: Response, next: NextFunction) {
        const { theoryId } = req.params;
        const { title, url, description, status } = req.body;
        if (!theoryId || (!title && !url && !description && !status)) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(theoryId) || (status && !(status in Status))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TheoryService.saveTheory({
                    id: theoryId,
                    title,
                    url,
                    description,
                    status,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
