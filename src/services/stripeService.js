// src/services/stripeService.js
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createProSubscriptionSession = async (userEmail) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID, 
        quantity: 1
      }
    ],
    customer_email: userEmail,
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`
  })
}

