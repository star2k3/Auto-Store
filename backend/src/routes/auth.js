import { Router } from 'express';
import { createUser, findUserByEmail, verifyUserPassword } from '../store.js';
import { signToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

const toPublicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address ?? ''
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password, address = '' } = req.body ?? {};
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const user = await createUser({ name, email: normalizedEmail, password, address });
    const token = signToken(user);
    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const valid = await verifyUserPassword(user, password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
