import { Router } from 'express';
import { isMongoEnabled } from '../db.js';
import { findCarById, findCarImageById, listCars } from '../store.js';

const router = Router();

const buildImageUrl = (req, id) => `${req.protocol}://${req.get('host')}/api/products/${id}/image`;

router.get('/', async (req, res, next) => {
  try {
    const cars = await listCars(req.query);
    const items = cars.map((car) => ({
      ...car,
      imageUrl: isMongoEnabled() ? buildImageUrl(req, car._id) : car.imageUrl
    }));
    res.json({ items, total: items.length });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/image', async (req, res, next) => {
  try {
    const carImage = await findCarImageById(req.params.id);
    if (!carImage || (isMongoEnabled() && !carImage.imageData)) {
      return res.status(404).json({ message: 'Car image not found' });
    }

    if (!isMongoEnabled()) {
      return res.redirect(carImage.imageUrl);
    }

    res.set('Content-Type', carImage.imageType || 'application/octet-stream');
    return res.send(carImage.imageData);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const car = await findCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.json({
      ...car,
      imageUrl: isMongoEnabled() ? buildImageUrl(req, car._id) : car.imageUrl
    });
  } catch (error) {
    next(error);
  }
});

export default router;
