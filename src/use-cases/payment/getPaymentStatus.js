import { paymentRepository } from "../../repository/paymentRepository.js"



export default class GetPaymentStatusUseCase {
  async execute (email) {
    if (!email) {
      throw new Error('Email is required')
    }
    try {
      const response = await paymentRepository.getPaymentStatus(email)
      return response
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
