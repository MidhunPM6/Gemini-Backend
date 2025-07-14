import { userRepository } from "../../repository/userRepository.js"



export default class FetchChatroomsUsecase {

    excecute(userId) {
        try {
            if (!userId) {
                throw new Error('All fields are required')
            }
            const fetchChatrooms = userRepository.getChatroomsByID(userId)
            return fetchChatrooms
        } catch (error) {
            throw new Error(error.message)
        }
    }
}