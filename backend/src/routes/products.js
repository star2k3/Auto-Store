import { Router } from 'express';
import { findCarById, listCars } from '../store.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const cars = await listCars(req.query);
    res.json({ items: cars, total: cars.length });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const car = await findCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.json(car);
  } catch (error) {
    next(error);
  }
});

export default router;
