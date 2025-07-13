import jwt from 'jsonwebtoken'

export const verifyJwtToken = (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' })
    }

    const token = req.headers.authorization.split(' ')[1]

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = payload

    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid or expired token' })
  }
}
