import { authRepository } from '../../repository/authRepository.js'
import bcrypt, { hash } from 'bcrypt'
export default class SignupUsecase {
  async execute (userData) {
    if (!userData) {
      throw new Error('All fields are required')
    }

    try {
      const isExistingUser = await authRepository.findUser({
        email: userData.email
      })
      if (isExistingUser) {
        throw new Error('User already exists')
      }
      const hashPassword = await bcrypt.hash(userData.password, 10)
      const createUser = await authRepository.saveUser({...userData,password: hashPassword})

      const response = {
        success: true,
        message: 'User created successfully',
        data: createUser
      }
      console.log(response)
      return response
    } catch (error) {
      console.error(error)

      throw new Error(error.message)
    }
  }
}
