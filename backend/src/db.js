import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { carsSeed } from './data/carsSeed.js';

export const inMemoryDb = {
  cars: [],
  orders: [],
  users: [],
  carSequence: 0
};

const resetMemoryCars = () => {
  inMemoryDb.cars = carsSeed.map((car, index) => ({
    ...car,
    _id: `mem-${index + 1}`
  }));
  inMemoryDb.carSequence = inMemoryDb.cars.length;
};

const resetMemoryUsers = () => {
  inMemoryDb.users = [
    {
      _id: 'user-1',
      name: 'Auto-Store Admin',
      email: 'admin@autostore.com',
      passwordHash: bcrypt.hashSync('Admin123!', 10),
      role: 'admin',
      address: 'Auto-Store HQ'
    }
  ];
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

  if (inMemoryDb.users.length === 0) {
    resetMemoryUsers();
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
  resetMemoryUsers();
};
