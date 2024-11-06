import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { UserService } from '~/app/services';
import { User } from '~/app/models';
import { ResponseUtil } from '~/utils';

export class UserController {
    static async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if (!email || !password) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.login(email, password);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        const { email, password, fullName, phoneNumber, avatar, currentGrade } = req.body;

        if (!email || !password || !fullName || !phoneNumber || !currentGrade) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.register(
                    email,
                    password,
                    fullName,
                    phoneNumber,
                    avatar ||
                        'https://github.com/user-attachments/assets/dec83469-0ca0-423a-a6ea-a543977e6ab1',
                    currentGrade,
                );
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async sendOTPByMail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;

        if (!email) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.sendOTPByMail(email);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async verifyOTP(req: Request, res: Response, next: NextFunction) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.verifyOTP(email, otp);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async getUsersByRole(req: Request, res: Response, next: NextFunction) {
        const { role } = req.params;
        const { page, limit } = req.query;
        let { sortBy, order } = req.query;

        try {
            // Kiểm tra và chuyển đổi các tham số
            const pageNum = Number(page) > 0 ? Number(page) : 1; // Gán 1 nếu page không hợp lệ
            const limitNum = Number(limit) > 0 ? Number(limit) : 10; // Gán 10 nếu limit không hợp lệ
            sortBy = typeof sortBy === 'string' ? sortBy : 'fullName'; // Gán 'fullName' nếu sortBy không hợp lệ
            order = order === 'ASC' || order === 'DESC' ? order : 'ASC'; // Gán 'ASC' nếu order không hợp lệ

            // Kiểm tra role
            if (!role) {
                ResponseUtil.sendMissingData(res);
            } else if (Number(role) < 0 || Number(role) > 1) {
                ResponseUtil.sendInvalidData(res);
            } else {
                const response = await UserService.getUsersByRole(
                    Number(role),
                    pageNum,
                    limitNum,
                    sortBy,
                    order as 'ASC' | 'DESC',
                );
                ResponseUtil.sendResponse(res, response);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(id)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await UserService.getUserById(id);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async updateUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { fullName, phoneNumber, avatar, currentGrade, totalPoint } = req.body;

        if (!id) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(id)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const data: Partial<User> = {
                    fullName,
                    phoneNumber,
                    avatar,
                    currentGrade,
                    totalPoint,
                };
                const response = await UserService.updateUserById(id, data);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    static async deleteUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) {
            ResponseUtil.sendMissingData(res);
        } else if (!isUUID(id)) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await UserService.deleteUserById(id);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }
}
