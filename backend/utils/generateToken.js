// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';
import { env } from '../../env.js';

function generateToken(res, userId) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '200d', // ~6 months
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JS access
    secure: env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 200 * 24 * 60 * 60 * 1000, // ~6 months
  });
}

export default generateToken;
