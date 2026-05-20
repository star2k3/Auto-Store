import { Router } from 'express';
import { createCar, deleteCar, findCarById, listCars, updateCar } from '../store.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';

const router = Router();

const parseColors = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((color) => color.trim()).filter(Boolean);
  }
  return [];
};

const validateCarPayload = (payload) => {
  const requiredFields = [
    'productCode',
    'company',
    'model',
    'category',
    'pricePkr',
    'year',
    'stock',
    'imageUrl',
    'summary',
    'fuelType',
    'transmission',
    'horsepower',
    'topSpeedKph'
  ];

  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === '');
  if (missing.length > 0) {
    return `Missing fields: ${missing.join(', ')}.`;
  }

  const numericFields = ['pricePkr', 'year', 'stock', 'horsepower', 'topSpeedKph'];
  for (const field of numericFields) {
    const value = Number(payload[field]);
    if (Number.isNaN(value)) return `Invalid numeric value for ${field}.`;
  }

  if (Number(payload.pricePkr) < 1) return 'Price must be greater than zero.';
  if (Number(payload.stock) < 0) return 'Stock cannot be negative.';

  const colors = parseColors(payload.colors);
  if (colors.length === 0) return 'At least one color is required.';

  return '';
};

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

router.post('/', adminLimiter, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const errorMessage = validateCarPayload(req.body ?? {});
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const car = await createCar({ ...req.body, colors: parseColors(req.body?.colors) });
    return res.status(201).json(car);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', adminLimiter, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const errorMessage = validateCarPayload(req.body ?? {});
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const updated = await updateCar(req.params.id, { ...req.body, colors: parseColors(req.body?.colors) });
    if (!updated) return res.status(404).json({ message: 'Car not found' });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', adminLimiter, requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const removed = await deleteCar(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Car not found' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
