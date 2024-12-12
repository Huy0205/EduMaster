import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { CourseService, TopicService } from  '../../app/services';
import { ResponseUtil } from '../../utils';
import { Role, Status } from '../enums';

export class TopicController {
    public static async getAllTopics(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TopicService.getAllTopics();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async getTopicByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;

        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.getTopicByGrade(Number(grade));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let role = Role.STUDENT;
            if (Number(req.headers['role']) in Role) {
                role = Number(req.headers['role']);
            }
            try {
                const response = await TopicService.getTopicsByCourse(courseId, role);
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
                const response = await TopicService.saveTopic({
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

    public static async updateTopic(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;
        const { topicName, status } = req.body;

        if (!topicId || (!topicName && status === undefined)) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(topicId) || (status !== undefined && !(status in Status))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.saveTopic({
                    id: topicId,
                    name: topicName,
                    status,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
