import { verify } from 'crypto'
import client from '../config/database.js'

export const authRepository = {
  findUser: async user => {
    const { rows } = await client.query(
      `SELECT * FROM auth.users WHERE mobile = '${user.mobile}'`
    )
    return rows[0]
  },
  saveUser: async user => {
    const { rows } = await client.query(
      `INSERT INTO auth.users (name, email, password, mobile) VALUES ('${user.name}', '${user.email}', '${user.password}', '${user.mobile}') RETURNING *`
    )
    return rows[0]
  },
  saveOtp: async (mobile, otp,expires_at) => {
    const { rows } = await client.query(
      `INSERT INTO auth.otp (mobile, otp,expires_at) VALUES ($1, $2, $3)`,
  [mobile, otp, expires_at]
    )
    return rows[0]
  },

  verifyOtp: async (mobile, otp) => {
    const { rows } = await client.query(
      `SELECT * FROM auth.otp WHERE $1 = mobile AND $2 = otp AND now() < expires_at`,[mobile, otp]
    )
    return rows[0]
  },
  
}
