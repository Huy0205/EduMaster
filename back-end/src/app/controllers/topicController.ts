import { NextFunction, Request, Response } from 'express';
import { TopicService } from '~/app/services';

export class TopicController {
  static async getTopicsByCourse(req: Request, res: Response, next: NextFunction) {
    const { courseId } = req.params;

    if (!courseId) {
      res.status(400).json({ message: 'Course ID is required' });
    } else {
      try {
        const response = await TopicService.getTopicsByCourse(courseId);
        res.status(response.code).json(response);
      } catch (error) {
        next(error);
      }
    }
  }

  static async getTopicById(req: Request, res: Response, next: NextFunction) {
    const { topicId } = req.params;

    if (!topicId) {
      res.status(400).json({ message: 'Topic ID is required' });
    } else {
      try {
        const response = await TopicService.getTopicById(topicId);
        res.status(response.code).json(response);
      } catch (error) {
        next(error);
      }
    }
  }
}
