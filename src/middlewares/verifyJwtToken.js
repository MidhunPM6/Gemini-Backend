import jwt from 'jsonwebtoken'

export const verifyJwtToken = (req, res, next) => {
  try {
    let token = null


    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

 
    if (!token && req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = payload
    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' })
  }
}