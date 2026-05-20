import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { findUserByEmail, findUserById, updateUser, verifyUserPassword } from '../store.js';
import { requireAuth } from '../middleware/auth.js';
import { accountLimiter } from '../middleware/rateLimit.js';

const router = Router();

const toPublicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address ?? ''
});

router.get('/me', accountLimiter, requireAuth, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(toPublicUser(user));
  } catch (error) {
    return next(error);
  }
});

router.put('/me', accountLimiter, requireAuth, async (req, res, next) => {
  try {
    const { name, email, address, currentPassword, newPassword } = req.body ?? {};

    const updates = {};

    if (name) updates.name = name;
    if (address !== undefined) updates.address = address;

    const normalizedEmail = email?.trim().toLowerCase();
    const currentEmail = req.user.email?.trim().toLowerCase();

    if (normalizedEmail && normalizedEmail !== currentEmail) {
      const existing = await findUserByEmail(normalizedEmail);
      if (existing && String(existing._id) !== req.user.id) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }
      updates.email = normalizedEmail;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to update password.' });
      }

      const user = await findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });
      const valid = await verifyUserPassword(user, currentPassword);
      if (!valid) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await updateUser(req.user.id, updates);
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    return res.json(toPublicUser(updated));
  } catch (error) {
    return next(error);
  }
});

export default router;
