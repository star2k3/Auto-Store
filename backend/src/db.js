import mongoose from 'mongoose';
import { carsSeed } from './data/carsSeed.js';

export const inMemoryDb = {
  cars: [],
  orders: []
};

const resetMemoryCars = () => {
  inMemoryDb.cars = carsSeed.map((car, index) => ({
    ...car,
    _id: `mem-${index + 1}`
  }));
};

export const isMongoEnabled = () => Boolean(process.env.MONGODB_URI);

export const connectDatabase = async () => {
  if (isMongoEnabled()) {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    return;
  }

  if (inMemoryDb.cars.length === 0) {
    resetMemoryCars();
  }
};

export const disconnectDatabase = async () => {
  if (isMongoEnabled()) {
    await mongoose.disconnect();
  }
};

export const resetInMemoryDatabase = () => {
  inMemoryDb.orders = [];
  resetMemoryCars();
};
