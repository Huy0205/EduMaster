import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { LectureService } from '~/app/services';
import { ResponseUtil } from '~/utils';

export class LectureController {
    static async getLecturesByReview(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;
        if (!reviewId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(reviewId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await LectureService.getLecturesByReview(reviewId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                console.log('Error getting lectures by review', error);
                next(error);
            }
        }
    }
}
