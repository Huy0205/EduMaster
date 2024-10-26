import { NextFunction, Request, Response } from 'express';
import { CourseService } from '~/app/services';
import { responseUtil } from '~/utils';

export class CourseController {
    static async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CourseService.getAllCourses();
            responseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    static async getCoursesByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;

        if (!grade) {
            responseUtil.sendResponse(res, {
                code: 400,
                message: 'Grade is required',
            });
        } else {
            try {
                const response = await CourseService.getCoursesByGrade(Number(grade));
                responseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
