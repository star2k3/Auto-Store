import { Car } from './models/Car.js';
import { Order } from './models/Order.js';
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

export const seedMongoCars = async () => {
  if (!isMongoEnabled()) return;
  const count = await Car.countDocuments();
  if (count === 0) await Car.insertMany(carsSeed);
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
  if (isMongoEnabled()) return Car.findById(id).lean();
  return inMemoryDb.cars.find((car) => car._id === id) ?? null;
};

export const findCarsByIds = async (ids) => {
  if (isMongoEnabled()) return Car.find({ _id: { $in: ids } }).lean();
  return inMemoryDb.cars.filter((car) => ids.includes(car._id));
};

export const createOrderAndReduceStock = async ({ customer, items }) => {
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
    const order = await Order.create({ customer, items: normalizedItems, totalPkr });
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
  inMemoryDb.orders.push({ orderId, customer, items: normalizedItems, totalPkr });

  return {
    orderId,
    totalPkr,
    itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};
