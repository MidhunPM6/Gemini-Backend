import jwt from 'jsonwebtoken'
export const verifyOptionalJwtToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = payload;
    } else {
      req.user = null; 
    }

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    req.user = null; 
    next();
}
}
