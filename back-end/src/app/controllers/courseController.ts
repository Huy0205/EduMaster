import { NextFunction, Request, Response } from 'express';
import { CourseService } from '~/app/services';

export class CourseController {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CourseService.getAllCourses();
      res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesByGrade(req: Request, res: Response, next: NextFunction) {
    const { grade } = req.params;

    if (!grade) {
      res.status(400).json({ message: 'Grade is required' });
    } else {
      try {
        const response = await CourseService.getCoursesByGrade(Number(grade));
        res.status(response.code).json(response);
      } catch (error) {
        next(error);
      }
    }
  }
}
