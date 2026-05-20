import jwt from 'jsonwebtoken';
import { findUserById } from '../store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
};

export const signToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: '7d' });

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Authentication required.' });

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
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Authentication required.' });

    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email, address: user.address ?? '' };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
};
