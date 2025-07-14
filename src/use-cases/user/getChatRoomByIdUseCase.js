import { userRepository } from "../../repository/userRepository.js"

export default class GetChatRoomByIdUseCase {
    async execute(chatId){
        if(!chatId){
            throw new Error('Chat id is required')
        }
        try{
            const chatRoom = await userRepository.getChatroomById(chatId)
            if(!chatRoom){
                throw new Error('Chat room not found')
            }
            return chatRoom
        }catch(err){
            throw new Error(err.message)
        }
        
    }
}