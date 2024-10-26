import { NextFunction, Request, Response } from 'express';
import { LectureService } from '../services';
import { responseUtil } from '~/utils';

export class LectureController {
    static async getLecturesByReview(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;
        if (!reviewId) {
            res.status(400).json({
                code: 400,
                message: 'Review ID is required',
            });
        } else {
            try {
                const response = await LectureService.getLecturesByReview(reviewId);
                responseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting lectures by review', error);
                next(error);
            }
        }
    }
}
