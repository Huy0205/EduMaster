import { NextFunction, Request, Response } from 'express';
import { UserService } from '~/app/services';
import { User } from '~/app/models';

export default class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
      }
      const response = await UserService.login(email, password);
      const { code, message, data } = response;
      res.status(code).json({ message, data });
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
        const response = await UserService.register(
          email,
          password,
          fullName,
          phoneNumber,
          avatar, // chưa có ảnh mặc định
          grade,
        );
        const { code, message, data } = response;
        res.status(code).json({ message, data });
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

      console.log('role', role);
      console.log(isNaN(Number(role)));

      // Kiểm tra role
      if (!role || isNaN(Number(role))) {
        res.status(400).json({ message: 'Role is required and must be a number' });
      } else if (Number(role) < 0 || Number(role) > 1) {
        res.status(400).json({ message: 'Role must be 0 or 1' });
      } else {
        const response = await UserService.getUsersByRole(
          Number(role),
          pageNum,
          limitNum,
          sortBy,
          order as 'ASC' | 'DESC',
        );
        res.status(200).json({
          message: 'Get users by role success',
          data: response,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const response = await UserService.getUserById(id);
      const { code, message, data } = response;
      res.status(code).json({ message, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { email, fullName, phoneNumber, avatar, grade } = req.body;

    try {
      const data: Partial<User> = {
        email,
        fullName,
        phoneNumber,
        avatar,
        grade,
      };
      const response = await UserService.updateUserById(id, data);
      const { code, message } = response;
      res.status(code).json({ message });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const response = await UserService.deleteUserById(id);
      const { code, message } = response;
      res.status(code).json({ message });
    } catch (error) {
      next(error);
    }
  }
}
