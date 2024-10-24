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
}
