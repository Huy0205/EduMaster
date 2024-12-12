import { NextFunction, Request, Response } from 'express';
import { UserService } from '../app/services';

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req['currentUser'];
    try {
        const checkRes = await UserService.checkAdminByEmail(email);
        if (checkRes.data) {
            return next();
        }
        return res.status(403).json({
            code: 403,
            message: 'Forbidden',
        });
    } catch (error) {
        next(error);
    }
};
