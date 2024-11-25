import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { CourseService, TopicService } from '~/app/services';
import { ResponseUtil } from '~/utils';
import { Role, Status } from '../enums';

export class TopicController {
    public static async getAllTopics(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;

        try {
            const response = await TopicService.getAllTopics(pageNum, limitNum);
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    static async getTopicByGrade(req: Request, res: Response, next: NextFunction) {
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
                const response = await TopicService.getTopicByGrade(
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

    static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.ADMIN;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            const { page, limit } = req.query;
            const pageNum = Number(page) > 0 ? Number(page) : 1;
            const limitNum = Number(limit) > 0 ? Number(limit) : 10;
            try {
                const response = await TopicService.getTopicsByCourse(
                    courseId,
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

    static async getTopicById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!id) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(id)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.getTopicById(id);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async addTopic(req: Request, res: Response, next: NextFunction) {
        const { topicName, courseId } = req.body;

        if (!topicName || !courseId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const maxOrderRes = await TopicService.getMaxOrderInCourse(courseId);
                const courseRes = await CourseService.getCourseById(courseId);
                const response = await TopicService.addTopic({
                    name: topicName,
                    orderInCourse: maxOrderRes.data + 1,
                    course: courseRes.data,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateStatus(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        const { status } = req.body;
        if (!topicId || status === undefined) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId) || !(status in Status)) {
            console.log('invalid data');
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.updateStatus(topicId, status);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('error', error);
                next(error);
            }
        }
    }
}
