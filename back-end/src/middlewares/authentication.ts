import { NextFunction, Request, Response } from 'express';
import { TokenUtil } from '~/utils';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const whiteList = [
        // user
        '/user/login',
        '/user/register',
        '/user/send-otp-by-mail',
        '/user/verify-otp',

        // course
        '/course/grade/:grade',
    ];
    const isWhiteListed = whiteList.some((path) => {
        const regex = new RegExp(`^${path.replace(/:\w+/g, '\\w+')}$`);
        return regex.test(req.path);
    });

    if (isWhiteListed) {
        return next();
    }

    if (req?.headers?.authorization?.split(' ')?.[1]) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = TokenUtil.verifyToken(token);
            req['currentUser'] = decoded;
            return next();
        } catch (error) {
            console.log('Authentication error:', error);
            res.status(401).json({
                code: 401,
                message: 'Token is expired',
            });
        }
    } else {
        res.status(401).json({
            code: 401,
            message: 'Unauthorized',
        });
    }
};
