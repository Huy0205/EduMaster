import { NextFunction, Request, Response } from 'express';
import { AvatarFrameService } from '../services';
import { ResponseUtil } from '~/utils';

export class AvatarFrameController {
    public static async getAllAvatarFrames(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AvatarFrameService.getAllAvatarFrames();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    
}
