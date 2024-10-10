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
        throw new Error('Email is not exist');
      }
      const isPasswordMatch = await bcryptUtil.comparePassword(password, user.password);
      if (!isPasswordMatch) {
        throw new Error('Password is incorrect');
      }
      return user;
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
    grade: number,
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
        throw new Error('Email is already exist');
      }

      // check phone number is already exist
      const isPhoneNumberExist = await UserRepository.findOne({
        where: {
          phoneNumber,
        },
      });
      if (isPhoneNumberExist) {
        throw new Error('Phone number is already exist');
      }

      const hashPassword = await bcryptUtil.hashPassword(password);
      const user = await UserRepository.save({
        email,
        password: hashPassword,
        fullName,
        phoneNumber,
        avatar,
        grade,
        role,
      });
      return user;
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

      if (!users) {
        throw new Error('Get users failed');
      }

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
}
