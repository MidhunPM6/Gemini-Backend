import SubscriptionStatusUseCase from '../use-cases/payment/subscriptionStatusUseCase.js'
import SubscriptionUseCase from '../use-cases/payment/subscriptionUseCase.js'
import GetPaymentStatusUseCase from '../use-cases/payment/getPaymentStatus.js'
import StatusCodes from '../utils/statusCodes.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const subscriptionController = async (req, res) => {
  const { email } = req.user
  console.log(email)

  try {
    const subscriptionUseCase = new SubscriptionUseCase()
    const response = await subscriptionUseCase.execute(email)
    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'Subscription created successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export const stripeWebhookController = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      const paymentDetails = {
        email: session.customer_details.email,
        status: session.status
      }
      try {
        const subscriptionUseCase = new GetPaymentStatusUseCase()
        await subscriptionUseCase.execute(paymentDetails)
      } catch (error) {
        console.error('Webhook handler failed:', error.message)
        return res.status(StatusCodes.BAD_REQUEST).send(`Webhook handler failed: ${error.message}`)
      }
      break

    default:
      console.info(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}

export const subscriptionStatusController = async (req, res) => {
  const { email } = req.user
  try {
    const subscriptionUseCase = new SubscriptionStatusUseCase()
    const response = await subscriptionUseCase.execute(email)
    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'Subscription status fetched successfully'
    })
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}
