import { db } from '~/configs';
import { User } from '~/app/models';
import { Role } from '~/app/enums';
import * as cache from 'memory-cache';
import nodeMailer from 'nodemailer';
import { bcryptUtil, tokenUtil } from '~/utils';

const UserRepository = db.AppDataSource.getRepository(User);

export class UserService {
    /*
     * Login by email and password
     */
    static async login(email: string, password: string) {
        try {
            const user = await UserRepository.findOne({
                where: {
                    email,
                },
            });
            if (!user) {
                return {
                    code: 404,
                    message: 'Email is not exist',
                };
            }
            const isPasswordMatch = await bcryptUtil.comparePassword(password, user.password);
            if (!isPasswordMatch) {
                return {
                    code: 400,
                    message: 'Password is incorrect',
                };
            }
            const token = tokenUtil.generateToken(email);
            return {
                code: 200,
                message: 'Login success',
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber,
                        avatar: user.avatar,
                        currentGrade: user.currentGrade,
                        role: user.role,
                    },
                },
            };
        } catch (error) {
            console.log('Error logging in', error);
            throw error;
        }
    }

    /*
     * Register a new Student
     */
    static async register(
        email: string,
        password: string,
        fullName: string,
        phoneNumber: string,
        avatar: string,
        currentGrade: number,
        role: Role = Role.STUDENT,
    ) {
        try {
            // check email is already exist
            const isEmailExist = await UserRepository.findOne({
                where: {
                    email,
                },
            });
            if (isEmailExist) {
                return {
                    code: 400,
                    message: 'Email is already exist',
                };
            }

            // check phone number is already exist
            const isPhoneNumberExist = await UserRepository.findOne({
                where: {
                    phoneNumber,
                },
            });
            if (isPhoneNumberExist) {
                return {
                    code: 400,
                    message: 'Phone number is already exist',
                };
            }

            const hashPassword = await bcryptUtil.hashPassword(password);
            const user = await UserRepository.save({
                email,
                password: hashPassword,
                fullName,
                phoneNumber,
                avatar,
                currentGrade,
                role,
            });
            return {
                code: 201,
                message: 'Register success',
                data: user,
            };
        } catch (error) {
            console.log('Error registering', error);
            throw error;
        }
    }

    /**
     * Send OTP by email
     * @param email
     * @returns
     */
    static async sendOTPByMail(email: string) {
        try {
            const user = await UserRepository.findOne({
                where: {
                    email,
                },
            });
            if (user) {
                return {
                    code: 400,
                    message: 'This email is already associated with an account.',
                };
            }

            const otp = Math.floor(100000 + Math.random() * 900000);
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            const mailOptions = {
                from: `"EduMaster" <${process.env.EMAIL}>`,
                to: email,
                subject: `${otp} là mã xác minh của bạn`,
                html:
                    "<div style='background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;'>" +
                    '<h1>Mã xác minh</h1>' +
                    "<p style='font-size:16px'>Để xác minh tài khoản của bạn hãy nhập mã này vào EduMaster:</p>" +
                    `<h2>${otp}</h2>` +
                    "<p style='font-size:16px'>Mã xác minh hết hạn sau 48 giờ.</p>" +
                    "<p style='font-size:16px'>Nếu bạn không yêu cầu mã, bạn có thể bỏ qua tin nhắn này.</p>" +
                    '</div>',
            };

            await transporter.sendMail(mailOptions);
            cache.put(email, otp, 5 * 60 * 1000);
            return {
                code: 200,
                message: 'OTP sent successfully',
            };
        } catch (error) {
            console.log('Error sending OTP', error);
            throw error;
        }
    }

    /**
     * Verify OTP by email
     * @param email
     * @param otp
     * @returns
     */
    static async verifyOTP(email: string, otp: string) {
        try {
            const otpInCache = cache.get(email);
            if (otpInCache === otp) {
                return {
                    code: 200,
                    message: 'OTP is correct',
                };
            }
            if (!otpInCache) {
                return {
                    code: 404,
                    message: 'OTP is expired',
                };
            }
            return {
                code: 400,
                message: 'OTP is incorrect',
            };
        } catch (error) {
            console.log('Error verifying OTP', error);
            throw error;
        }
    }

    /*
     * Get all users by role with pagination and sorting
     */
    static async getUsersByRole(
        role: Role,
        page: number,
        limit: number,
        sortBy: string,
        order: 'ASC' | 'DESC',
    ) {
        try {
            const [users, total] = await UserRepository.findAndCount({
                where: {
                    role,
                },
                order: {
                    [sortBy]: order,
                },
                take: limit,
                skip: (page - 1) * limit,
            });

            const totalPages = Math.ceil(total / limit);
            return {
                code: 200,
                message: 'Get users by role success',
                data: {
                    totalPages,
                    currentPage: page,
                    users,
                },
            };
        } catch (error) {
            console.log('Error getting users by role', error);
            throw error;
        }
    }

    /*
     * Get user by id
     */
    static async getUserById(id: string) {
        try {
            const user = await UserRepository.findOne({
                where: {
                    id,
                },
            });
            if (!user) {
                return {
                    code: 404,
                    message: 'User is not exist',
                };
            }
            return {
                code: 200,
                message: 'Get user by id success',
                data: user,
            };
        } catch (error) {
            console.log('Error getting user by id', error);
            throw error;
        }
    }

    /*
     * Update user by id
     */
    static async updateUserById(id: string, data: Partial<User>) {
        try {
            const user = await UserRepository.findOne({
                where: {
                    id,
                },
            });
            if (!user) {
                return {
                    code: 404,
                    message: 'User is not exist',
                };
            }
            await UserRepository.update(id, data);
            return {
                code: 200,
                message: 'Update user success',
            };
        } catch (error) {
            console.log('Error updating user', error);
            throw error;
        }
    }

    /*
     * Delete user by id
     */
    static async deleteUserById(id: string) {
        try {
            const user = await UserRepository.findOne({
                where: {
                    id,
                },
            });
            if (!user) {
                return {
                    code: 404,
                    message: 'User is not exist',
                };
            }
            await UserRepository.delete(id);
            return {
                code: 200,
                message: 'Delete user success',
            };
        } catch (error) {
            console.log('Error deleting user', error);
            throw error;
        }
    }
}
