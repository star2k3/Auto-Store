import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { resolveAdminPassword } from './adminSeed.js';
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

const resetMemoryUsers = async () => {
  const passwordHash = await bcrypt.hash(resolveAdminPassword(), 10);
  inMemoryDb.users = [
    {
      _id: 'user-1',
      name: 'Auto-Store Admin',
      email: 'admin@autostore.com',
      passwordHash,
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
    await resetMemoryUsers();
  }
};

export const disconnectDatabase = async () => {
  if (isMongoEnabled()) {
    await mongoose.disconnect();
  }
};

export const resetInMemoryDatabase = async () => {
  inMemoryDb.orders = [];
  resetMemoryCars();
  await resetMemoryUsers();
};
