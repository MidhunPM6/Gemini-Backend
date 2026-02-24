import client from "../config/database.js";

export const paymentRepository={
        savePaymentData: async paymentData => {

            const { rows } = await client.query(
              `INSERT INTO subscription.pro_subscription (user_email, status ,subscription_id) VALUES ($1, $2, $3) RETURNING *`,
              [paymentData.email, paymentData.status,paymentData.subscriptionId]
            )
            return rows[0]
        },
        getPaymentStatus: async (email) => {
            const { rows } = await client.query(
              `SELECT * FROM subscription.pro_subscription WHERE user_email = $1`,
              [email]
            )
            return rows[0]
        },

}