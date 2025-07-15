import { paymentRepository } from "../../repository/paymentRepository.js";


export default class SubscriptionStatusUseCase {
    async execute(paymentData) {
        if(!paymentData) {
            throw new Error('Payment data is required')
        }

        
        try {
            const savePaymentStatus = await paymentRepository.getPaymentStatus(paymentData)
            return savePaymentStatus
        } catch (error) {
            throw new Error(error.message)
        }
    }
}