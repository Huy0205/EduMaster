import { NextFunction, Request, Response } from 'express';
import { CourseService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class CourseController {
    static async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CourseService.getAllCourses();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    static async getCoursesByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;

        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (isNaN(Number(grade))) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await CourseService.getCoursesByGrade(Number(grade));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getCourseById(req: Request, res: Response, next: NextFunction) {
        const { courseId } = req.params;

        if (!courseId) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await CourseService.getCourseById(courseId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getGradeDistinct(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CourseService.getGradeDistinct();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }
}
