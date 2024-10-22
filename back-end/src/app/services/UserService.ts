import { db } from '~/configs';
import { User } from '~/app/models';
import { Role } from '~/app/enums';
import { bcryptUtil } from '~/utils';

const UserRepository = db.AppDataSource.getRepository(User);

export default class UserService {
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
      return {
        code: 200,
        message: 'Login success',
        data: user,
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
        totalPages,
        currentPage: page,
        users,
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
