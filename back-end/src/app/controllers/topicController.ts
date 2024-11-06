import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { CourseService, TopicService } from '~/app/services';
import { Topic } from '../models';
import { ResponseUtil } from '~/utils';

export class TopicController {
    static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;

        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(courseId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await TopicService.getTopicsByCourse(courseId);
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
        let { order } = req.body;

        if (!name || !courseId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                if (order) {
                    await TopicService.setOrderForTopicByCourse(courseId, order);
                } else {
                    const resTotalTopics = await TopicService.countTopicsByCourse(courseId);
                    order = resTotalTopics.data + 1;
                }
                const courseRes = await CourseService.getCourseById(courseId);
                const topic: Partial<Topic> = { name, order, course: courseRes.data };
                const response = await TopicService.addTopic(topic);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
