import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Car } from './models/Car.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';
import { carsSeed } from './data/carsSeed.js';
import { inMemoryDb, isMongoEnabled } from './db.js';

const buildFilter = ({ search = '', company = '', category = '', minPrice, maxPrice }) => {
  if (isMongoEnabled()) {
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { model: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (company.trim()) filter.company = company.trim();
    if (category.trim()) filter.category = category.trim();

    if (minPrice || maxPrice) {
      filter.pricePkr = {};
      if (minPrice) filter.pricePkr.$gte = Number(minPrice);
      if (maxPrice) filter.pricePkr.$lte = Number(maxPrice);
    }

    return filter;
  }

  return { search, company, category, minPrice, maxPrice };
};

const ensureValidObjectId = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new mongoose.Error.CastError('ObjectId', value, 'id');
  }
};

const toObjectId = (value) => {
  ensureValidObjectId(value);
  return new mongoose.Types.ObjectId(value);
};

export const seedMongoCars = async () => {
  if (!isMongoEnabled()) return;
  const count = await Car.countDocuments();
  if (count === 0) await Car.insertMany(carsSeed);
};

export const seedMongoUsers = async () => {
  if (!isMongoEnabled()) return;
  const count = await User.countDocuments();
  if (count > 0) return;
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await User.create({
    name: 'Auto-Store Admin',
    email: 'admin@autostore.com',
    passwordHash,
    role: 'admin',
    address: 'Auto-Store HQ'
  });
};

export const listCars = async (query) => {
  const filter = buildFilter(query);

  if (isMongoEnabled()) {
    const cars = await Car.find(filter).sort({ pricePkr: 1 }).lean();
    return cars;
  }

  const { search, company, category, minPrice, maxPrice } = filter;
  return inMemoryDb.cars
    .filter((car) => {
      const searchOk = !search.trim() || `${car.name} ${car.model}`.toLowerCase().includes(search.trim().toLowerCase());
      const companyOk = !company.trim() || car.company === company.trim();
      const categoryOk = !category.trim() || car.category === category.trim();
      const minOk = !minPrice || car.pricePkr >= Number(minPrice);
      const maxOk = !maxPrice || car.pricePkr <= Number(maxPrice);
      return searchOk && companyOk && categoryOk && minOk && maxOk;
    })
    .sort((a, b) => a.pricePkr - b.pricePkr);
};

export const findCarById = async (id) => {
  if (isMongoEnabled()) {
    const objectId = toObjectId(id);
    return Car.findById(objectId).lean();
  }
  return inMemoryDb.cars.find((car) => car._id === id) ?? null;
};

export const findCarsByIds = async (ids) => {
  if (isMongoEnabled()) {
    const objectIds = ids.map((id) => toObjectId(id));
    return Car.find({ _id: { $in: objectIds } }).lean();
  }
  return inMemoryDb.cars.filter((car) => ids.includes(car._id));
};

const normalizeCarPayload = (payload) => {
  const normalized = { ...payload };
  const numericFields = ['pricePkr', 'year', 'stock', 'horsepower', 'topSpeedKph'];

  numericFields.forEach((field) => {
    if (normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  });

  if (typeof normalized.colors === 'string') {
    normalized.colors = normalized.colors.split(',').map((color) => color.trim()).filter(Boolean);
  }

  if (!normalized.name && normalized.company && normalized.model) {
    normalized.name = `${normalized.company} ${normalized.model}`;
  }

  return normalized;
};

export const createCar = async (payload) => {
  const normalized = normalizeCarPayload(payload);
  if (isMongoEnabled()) {
    const car = await Car.create(normalized);
    return car.toObject();
  }

  const nextId = `mem-${inMemoryDb.carSequence + 1}`;
  inMemoryDb.carSequence += 1;
  const car = { ...normalized, _id: nextId };
  inMemoryDb.cars.push(car);
  return car;
};

export const updateCar = async (id, payload) => {
  const normalized = normalizeCarPayload(payload);

  if (isMongoEnabled()) {
    const objectId = toObjectId(id);
    const car = await Car.findByIdAndUpdate(objectId, normalized, { new: true, runValidators: true }).lean();
    return car;
  }

  const index = inMemoryDb.cars.findIndex((car) => car._id === id);
  if (index === -1) return null;
  inMemoryDb.cars[index] = { ...inMemoryDb.cars[index], ...normalized };
  return inMemoryDb.cars[index];
};

export const deleteCar = async (id) => {
  if (isMongoEnabled()) {
    const objectId = toObjectId(id);
    const result = await Car.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  const initialLength = inMemoryDb.cars.length;
  inMemoryDb.cars = inMemoryDb.cars.filter((car) => car._id !== id);
  return inMemoryDb.cars.length !== initialLength;
};

export const findUserByEmail = async (email) => {
  if (isMongoEnabled()) return User.findOne({ email }).lean();
  return inMemoryDb.users.find((user) => user.email === email) ?? null;
};

export const findUserById = async (id) => {
  if (isMongoEnabled()) return User.findById(id).lean();
  return inMemoryDb.users.find((user) => user._id === id) ?? null;
};

export const createUser = async ({ name, email, password, address = '' }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  if (isMongoEnabled()) {
    const user = await User.create({ name, email, passwordHash, address });
    return user.toObject();
  }

  const nextId = `user-${inMemoryDb.users.length + 1}`;
  const user = { _id: nextId, name, email, passwordHash, role: 'user', address };
  inMemoryDb.users.push(user);
  return user;
};

export const updateUser = async (id, updates) => {
  if (isMongoEnabled()) {
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
    return user;
  }

  const index = inMemoryDb.users.findIndex((user) => user._id === id);
  if (index === -1) return null;
  inMemoryDb.users[index] = { ...inMemoryDb.users[index], ...updates };
  return inMemoryDb.users[index];
};

export const verifyUserPassword = async (user, password) => bcrypt.compare(password, user.passwordHash);

export const listOrdersByUser = async (userId) => {
  if (isMongoEnabled()) {
    return Order.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  return inMemoryDb.orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createOrderAndReduceStock = async ({ customer, items, userId }) => {
  const ids = items.map((item) => item.productId);
  const cars = await findCarsByIds(ids);
  const carById = new Map(cars.map((car) => [String(car._id), car]));

  let totalPkr = 0;
  const normalizedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);
    const car = carById.get(String(item.productId));

    if (!car || Number.isNaN(quantity) || quantity < 1) {
      throw new Error('INVALID_CART_ITEM');
    }

    if (quantity > car.stock) {
      throw new Error(`INSUFFICIENT_STOCK:${car.name}:${car.stock}`);
    }

    totalPkr += car.pricePkr * quantity;
    normalizedItems.push({
      carId: car._id,
      name: car.name,
      quantity,
      unitPricePkr: car.pricePkr
    });
  }

  if (isMongoEnabled()) {
    const order = await Order.create({ customer, items: normalizedItems, totalPkr, userId });
    await Promise.all(
      normalizedItems.map((item) => Car.updateOne({ _id: item.carId }, { $inc: { stock: -item.quantity } }))
    );

    return {
      orderId: order._id,
      totalPkr,
      itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  for (const item of normalizedItems) {
    const car = inMemoryDb.cars.find((entry) => entry._id === item.carId);
    car.stock -= item.quantity;
  }

  const orderId = `order-${inMemoryDb.orders.length + 1}`;
  inMemoryDb.orders.push({
    orderId,
    customer,
    userId,
    items: normalizedItems,
    totalPkr,
    createdAt: new Date().toISOString()
  });

  return {
    orderId,
    totalPkr,
    itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};
