import { paymentRepository } from "../../repository/paymentRepository.js"



export default class GetPaymentStatusUseCase {
  async execute (email,subscriptionId,status) {
    if (!email) {
      throw new Error('Email is required')
    }
    try {
      const response = await paymentRepository.savePaymentData(email,subscriptionId,status)
      return response
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
