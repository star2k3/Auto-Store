import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase, resetInMemoryDatabase } from '../src/db.js';

const app = createApp();

describe('Auto-Store API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(() => {
    resetInMemoryDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('returns seeded 100 cars and allows filtering by company', async () => {
    const allResponse = await request(app).get('/api/products');
    expect(allResponse.status).toBe(200);
    expect(allResponse.body.total).toBe(100);

    const toyotaResponse = await request(app).get('/api/products').query({ company: 'Toyota' });
    expect(toyotaResponse.status).toBe(200);
    expect(toyotaResponse.body.total).toBe(10);
  });

  it('creates checkout order', async () => {
    const carsResponse = await request(app).get('/api/products').query({ company: 'Honda' });
    const product = carsResponse.body.items[0];

    const checkoutResponse = await request(app).post('/api/checkout').send({
      customer: { name: 'Ali Khan', email: 'ali@example.com', address: 'Lahore, Pakistan' },
      items: [{ productId: product._id, quantity: 1 }]
    });

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.totalPkr).toBe(product.pricePkr);
    expect(checkoutResponse.body.itemCount).toBe(1);
  });
});
