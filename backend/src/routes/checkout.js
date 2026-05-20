import { Router } from 'express';
import { createOrderAndReduceStock } from '../store.js';
import { optionalAuth } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', checkoutLimiter, optionalAuth, async (req, res, next) => {
  try {
    const { customer, items } = req.body ?? {};
    const resolvedCustomer = customer ?? (req.user ? {
      name: req.user.name,
      email: req.user.email,
      address: req.user.address
    } : null);

    if (!resolvedCustomer?.name || !resolvedCustomer?.email || !resolvedCustomer?.address) {
      return res.status(400).json({ message: 'Customer name, email and address are required.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one cart item is required.' });
    }

    const summary = await createOrderAndReduceStock({ customer: resolvedCustomer, items, userId: req.user?.id });
    return res.status(201).json({
      ...summary,
      message: 'Checkout successful. Your booking has been received.'
    });
  } catch (error) {
    if (error.message === 'INVALID_CART_ITEM') {
      return res.status(400).json({ message: 'Invalid cart item in checkout request.' });
    }

    if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
      const [, carName, stock] = error.message.split(':');
      return res.status(400).json({ message: `${carName} has only ${stock} unit(s) in stock.` });
    }

    return next(error);
  }
});

export default router;
