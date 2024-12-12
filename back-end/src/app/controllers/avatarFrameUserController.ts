import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { AvatarFrameUserService } from '../services/avatarFrameUserService';
import { ResponseUtil } from '../../utils';

export class AvatarFrameUserController {
    public static async getAvatarFrameUsersByUser(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        if (!userId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await AvatarFrameUserService.getAvatarFrameUsersByUser(userId);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async addAvatarFrameUser(req: Request, res: Response, next: NextFunction) {
        const { userId, avatarFrameId } = req.body;
        if (!userId || !avatarFrameId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(avatarFrameId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                await AvatarFrameUserService.updateAllIsActiveFalse(userId);
                const response = await AvatarFrameUserService.addAvatarFrameUser({
                    userId,
                    avatarFrameId,
                    isActive: true,
                });
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateIsActiveTrueByAvatarFrame(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { userId, avatarFrameId } = req.body;
        if (!userId || !avatarFrameId) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(userId) || !isUUID(avatarFrameId)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await AvatarFrameUserService.updateIsActiveTrueByAvatarFrame(
                    userId,
                    avatarFrameId,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
