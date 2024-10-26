import { NextFunction, Request, Response } from 'express';
import { CourseService, TopicService } from '~/app/services';
import { Topic } from '../models';
import { responseUtil } from '~/utils';

export class TopicController {
    static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;

        if (!courseId) {
            res.status(400).json({ message: 'Course ID is required' });
        } else {
            try {
                const response = await TopicService.getTopicsByCourse(courseId);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getTopicById(req: Request, res: Response, next: NextFunction) {
        const { topicId } = req.params;

        if (!topicId) {
            responseUtil.sendResponse(res, {
                code: 400,
                message: 'Topic ID is required',
            });
        } else {
            try {
                const response = await TopicService.getTopicById(topicId);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async addTopic(req: Request, res: Response, next: NextFunction) {
        const { name, courseId } = req.body;
        let { order } = req.body;

        if (!name || !courseId) {
            responseUtil.sendResponse(res, {
                code: 400,
                message: 'Name and course ID are required',
            });
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
                responseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
