import { Router } from 'express';
import { createOrderAndReduceStock } from '../store.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { customer, items } = req.body ?? {};

    if (!customer?.name || !customer?.email || !customer?.address) {
      return res.status(400).json({ message: 'Customer name, email and address are required.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one cart item is required.' });
    }

    const summary = await createOrderAndReduceStock({ customer, items });
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
