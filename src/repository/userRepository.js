import client from '../config/database.js'

export const userRepository = {
  findUserById: async userId => {
    const { rows } = await client.query(
      `SELECT * FROM auth.users WHERE id = $1`,
      [userId]
    )
    return rows[0]
  },
  createChatroom: async (title, userId) => {
    const { rows } = await client.query(
      `INSERT INTO chatrooms.created_chatrooms (title, user_id) VALUES ($1, $2) RETURNING *`,
      [title, userId]
    )
    return rows[0]
  },

  getChatroomsByID: async userId => {
    const { rows } = await client.query(
      `SELECT * FROM chatrooms.created_chatrooms WHERE user_id = $1`,
      [userId]
    )
    return rows
  },
  getChatroomById: async chatroomId => {
    const { rows } = await client.query(
      `SELECT * FROM chatrooms.created_chatrooms WHERE id = $1`,
      [chatroomId]
    )
    return rows[0]
  },
  saveGeminiResponse: async (id, response, message) => {
    const { rows } = await client.query(
      `INSERT INTO chatrooms.gemini_messages (chatroom_id, gemini_response, message) VALUES ($1, $2, $3) RETURNING *`,
      [id, response, message]
    )

    return rows[0]
  }
}
