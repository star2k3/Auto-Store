import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { findUserById } from '../store.js';

const FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production.');
}

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Using an ephemeral development-only secret.');
}

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
};

const resolvedSecret = JWT_SECRET || FALLBACK_SECRET;

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, resolvedSecret, { expiresIn: '7d' });

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, resolvedSecret);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email, address: user.address ?? '' };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, resolvedSecret);
    const user = await findUserById(payload.sub);
    if (!user) return next();

    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email, address: user.address ?? '' };
    return next();
  } catch {
    return next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
};
