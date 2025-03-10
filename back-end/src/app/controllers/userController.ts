import { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { UserService } from '../../app/services';
import { BcryptUtil, ResponseUtil } from '../../utils';
import { Status } from '../enums';

export class UserController {
    public static async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        console.log(email, password);

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

    public static async register(req: Request, res: Response, next: NextFunction) {
        const { email, password, fullName, phoneNumber, avatar, currentGrade } = req.body;

        if (!email || !password || !fullName || !phoneNumber || !currentGrade) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const hashPassword = await BcryptUtil.hashPassword(password);
                const response = await UserService.register(
                    email,
                    hashPassword,
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

    public static async sendOTPByMail(req: Request, res: Response, next: NextFunction) {
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

    public static async verifyOTP(req: Request, res: Response, next: NextFunction) {
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

    public static async getUsersByRole(req: Request, res: Response, next: NextFunction) {
        const { role } = req.params;

        if (!role) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(role) < 0 || Number(role) > 1) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await UserService.getUsersByRole(Number(role));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async getUserById(req: Request, res: Response, next: NextFunction) {
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

    public static async getUsersByGrade(req: Request, res: Response, next: NextFunction) {
        const { grade } = req.params;
        if (!grade) {
            ResponseUtil.sendMissingData(res);
        } else if (Number(grade) < 1 || Number(grade) > 5) {
            ResponseUtil.sendInvalidData(res);
        } else {
            try {
                const response = await UserService.getUsersByGrade(Number(grade));
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async authUser(req: Request, res: Response, next: NextFunction) {
        const { email } = req['currentUser'];
        if (!email) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.getUserByEmail(email);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { password, fullName, phoneNumber, avatar, currentGrade, totalPoint, status } =
            req.body;

        if (
            !id ||
            (!password &&
                !fullName &&
                !phoneNumber &&
                !avatar &&
                !currentGrade &&
                totalPoint === undefined &&
                status === undefined)
        ) {
            ResponseUtil.sendMissingData(res);
        } else if (
            !isUUID(id) ||
            (currentGrade && (currentGrade < 1 || currentGrade > 5)) ||
            (totalPoint && Number(totalPoint) < 0) ||
            (status && !(status in Status))
        ) {
            ResponseUtil.sendInvalidData(res);
        } else {
            let hashPassword = password;
            if (password) {
                hashPassword = await BcryptUtil.hashPassword(password);
            }
            try {
                const response = await UserService.saveUser({
                    id,
                    password: hashPassword,
                    fullName,
                    phoneNumber,
                    avatar,
                    currentGrade,
                    totalPoint,
                    status,
                });
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

    public static async checkPasswordByEmail(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        if (!email || !password) {
            ResponseUtil.sendMissingData(res);
        } else {
            try {
                const response = await UserService.checkPasswordByEmail(email, password);
                ResponseUtil.sendResponse(res, response);
            } catch (error) {
                next(error);
            }
        }
    }

    public static async countStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await UserService.countStudent();
            ResponseUtil.sendResponse(res, response);
        } catch (error) {
            next(error);
        }
    }

    public static async getNewUsersPerMonth(req: Request, res: Response, next: NextFunction) {
        const { startMonth, endMonth } = req.query;
        if (!startMonth || !endMonth) {
            ResponseUtil.sendMissingData(res);
        } else {
            const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
            if (!monthRegex.test(startMonth as string) || !monthRegex.test(endMonth as string)) {
                ResponseUtil.sendInvalidData(res);
            } else {
                try {
                    const response = await UserService.getNewUsersPerMonth(
                        startMonth as string,
                        endMonth as string,
                    );
                    ResponseUtil.sendResponse(res, response);
                } catch (error) {
                    next(error);
                }
            }
        }
    }
}
