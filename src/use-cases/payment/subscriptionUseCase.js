import { createProSubscriptionSession } from "../../services/stripeService.js"


export default class SubscriptionUseCase {
    async execute(userEmail){
        try {
            if(!userEmail){
                throw new Error('Email is required')
            }
            const getResponse = await createProSubscriptionSession(userEmail)
            if(!createProSubscriptionSession){
                throw new Error('Subscription not created')
            }
            
            
            
            return getResponse.url
        } catch (error) {
            throw new Error(error.message)
        }
    }
}   