import { authRepository } from "../../repository/authRepository.js"
import bcrypt from 'bcrypt'


export default class ChangePasswordUseCase {
    async changePassword(mobile,currentPassword,newPassword) {
        if(!mobile || !currentPassword || !newPassword) {
            throw new Error('All fields are required')
        }
        try {
            const findUser = await authRepository.findUser({mobile})
            if(!findUser) {
                throw new Error('User not found')
            }
            const verifyPassword = await bcrypt.compare(currentPassword,findUser.password)
            if(!verifyPassword) {
                throw new Error('Current password is incorrect')
            }
            const hashPassword = await bcrypt.hash(newPassword,10)
            const changePassword = await authRepository.changePassword(mobile,hashPassword)
            const response = {
                success: true,
                message: 'Password changed successfully',
                data: changePassword
            }
            return response
        } catch (error) {
            throw new Error(error.message)
        }

    }

    async forgotPassword(mobile,otp,newPassword) {
        if(!mobile) {
            throw new Error('Mobile number is required')
        }
        try {
           const verifyOtp = await authRepository.verifyOtpForgotPassword(mobile,otp)
           if(!verifyOtp){
               throw new Error('Invalid OTP')
           }
           const hashPassword = await bcrypt.hash(newPassword,10)
           const changePassword = await authRepository.changePassword(mobile,hashPassword)
           const response = {
               success: true,
               message: 'Password changed successfully',
               data: changePassword
           }
           return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}