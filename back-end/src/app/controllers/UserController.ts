import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await UserService.login(email, password)
    if (!user) {
      res.status(400).send('Invalid email or password')
    } else {
      res.send(user)
    }
  } catch (error) {
    console.log('Error logging in', error)
    res.status(500).send('Error logging in')
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullName, phoneNumber, avatar, grade, role } = req.body

  try {
    const user = await UserService.register(
      email,
      password,
      fullName,
      phoneNumber,
      avatar,
      grade,
      role,
    )
    if (!user) {
      res.status(400).send('Error registering')
    } else {
      res.send(user)
    }
  } catch (error) {
    console.log('Error registering', error)
    res.status(500).send('Error registering')
  }
}
