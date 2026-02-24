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

  try {
    switch (event.type) {

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        const email = invoice.customer_email
        const subscriptionId = invoice.subscription

        console.log('Subscription payment successful for:', email)

        const subscriptionUseCase = new GetPaymentStatusUseCase()
        await subscriptionUseCase.execute({
          email,
          subscriptionId,
          status: 'active'
        })

        break
      }
      case 'checkout.session.completed': {
        console.log('Checkout session completed')
        break
      }

      default:
      
        break
    }

    res.json({ received: true })

  } catch (error) {
    console.error('Webhook handler failed:', error.message)
    res.status(400).send(`Webhook handler failed: ${error.message}`)
  }
}

export const subscriptionStatusController = async (req, res) => {
  const { email } = req.user
  try {
    const subscriptionUseCase = new SubscriptionStatusUseCase()
    const response = await subscriptionUseCase.execute(email)
    console.log(response);
    
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
