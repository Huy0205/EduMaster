import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { CourseService, TopicService } from '~/app/services';
import { Topic } from '../models';
import { ResponseUtil } from '~/utils';

export class TopicController {
    static async getAllTopics(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TopicService.getAllTopics();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;
        const role = req.headers['role'] ? parseInt(req.headers['role'].toString()) : undefined;

        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.getTopicsByCourse(courseId, role);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getTopicByGrade(req: Request, res: Response, next: NextFunction) {
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

    static async addTopic(req: Request, res: Response, next: NextFunction) {
        const { name, courseId } = req.body;
        let { orderInCourse } = req.body;

        if (!name || !courseId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                if (orderInCourse) {
                    await TopicService.setOrderForTopicByCourse(courseId, orderInCourse);
                } else {
                    const resTotalTopics = await TopicService.countTopicsByCourse(courseId);
                    orderInCourse = resTotalTopics.data + 1;
                }
                const courseRes = await CourseService.getCourseById(courseId);
                const topic: Partial<Topic> = { name, orderInCourse, course: courseRes.data };
                const response = await TopicService.addTopic(topic);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
