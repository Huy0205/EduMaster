import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const whiteList = ['/user/login', '/user/register'];
    if (whiteList.includes(req.path)) {
        return next();
    }

    if (req?.headers?.authorization?.split(' ')?.[1]) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
