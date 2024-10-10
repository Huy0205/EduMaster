import { NextFunction, Request, Response } from 'express';
import { UserService } from '~/app/services';

export default class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await UserService.login(email, password);
      if (!user) {
        res.status(400).json({ message: 'Invalid email or password' });
      } else {
        res.status(200).json({
          message: 'Login success',
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, fullName, phoneNumber, avatar, grade } = req.body;

    try {
      if (!email || !password || !fullName || !phoneNumber || !grade) {
        res
          .status(400)
          .json({ message: 'Email, password, fullName, phoneNumber, grade are required' });
      } else {
        const user = await UserService.register(
          email,
          password,
          fullName,
          phoneNumber,
          avatar, // chưa có ảnh mặc định
          grade,
        );
        if (!user) {
          res.status(400).json({ message: 'Register failed' });
        } else {
          res.status(201).json({
            message: 'Register success',
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
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
      if (!role || isNaN(Number(role))) {
        res.status(400).json({ message: 'Valid role is required' });
      } else {
        const users = await UserService.getUsersByRole(
          Number(role),
          pageNum,
          limitNum,
          sortBy,
          order as 'ASC' | 'DESC',
        );
        res.status(200).json({
          message: 'Get users by role success',
          data: users,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
