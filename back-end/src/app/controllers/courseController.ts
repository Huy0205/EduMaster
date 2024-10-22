import { NextFunction, Request, Response } from 'express';
import { CourseService } from '~/app/services';

export default class CourseController {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CourseService.getAllCourses();
      res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  }
}
