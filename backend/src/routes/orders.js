import { Router } from 'express';
import { listOrdersByUser } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await listOrdersByUser(req.user.id);
    return res.json({ items: orders });
  } catch (error) {
    return next(error);
  }
});

export default router;
