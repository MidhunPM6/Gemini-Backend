import client from '../config/database.js'

export const userRepository = {
  findUserById: async userId => {
    const { rows } = await client.query(
      `SELECT * FROM auth.users WHERE id = $1`,
      [userId]
    )
    return rows[0]
  }
}
