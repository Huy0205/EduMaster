import { db } from '~/configs'
import { User } from '~/app/models'
import { Role } from '~/app/enums'
import bcrypt from 'bcrypt'

const UserRepository = db.AppDataSource.getRepository(User)

export const UserService = {
  login: async (email: string, password: string) => {
    try {
      const user = await UserRepository.findOne({
        where: {
          email,
          password,
        },
      })
      return user
    } catch (error) {
      console.log('Error logging in', error)
      return null
    }
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    avatar: string,
    grade: number,
    role: Role = Role.STUDENT,
  ) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, 10)
      const user = await UserRepository.save({
        email,
        password: hashPassword,
        fullName,
        phoneNumber,
        avatar,
        grade,
        role,
      })
      return user
    } catch (error) {
      console.log('Error registering', error)
      return null
    }
  },
}
