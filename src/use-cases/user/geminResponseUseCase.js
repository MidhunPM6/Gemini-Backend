import { userRepository } from '../../repository/userRepository.js'

export default class GeminiResponseUseCase {
  constructor (chatroom_id, gemini_Response, message) {
    this.chatroom_id = chatroom_id
    this.gemini_Response = gemini_Response
    this.message = message
    this.execete()
  }
  async execete () {
    try {
      const response = await userRepository.saveGeminiResponse(
        this.chatroom_id,
        this.gemini_Response,
        this.message
      )
      if (!response) {
        throw new Error('Not found any response from API')
      }
      return response  
    } catch {
        throw new Error('Something went wrong')
    }
  }
}
