import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );
    return token;
  } catch (err) {
    console.error('Error generating JWT:', err);
    throw new Error('Token generation failed');
  }
};
