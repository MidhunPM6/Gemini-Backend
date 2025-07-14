import { userRepository } from "../../repository/userRepository.js"



export default class CreateChatroomUseCase {
  async excecute (title, userId) {
    try {
      if (!title || !userId) {
        throw new Error('All fields are required')
      }
      const createChatroom = await userRepository.createChatroom(title, userId)
      return createChatroom
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
