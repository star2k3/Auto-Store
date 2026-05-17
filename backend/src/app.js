import cors from 'cors';
import express from 'express';
import productsRouter from './routes/products.js';
import checkoutRouter from './routes/checkout.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/products', productsRouter);
  app.use('/api/checkout', checkoutRouter);

  app.use((error, _req, res, _next) => {
    if (error?.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid identifier.' });
    }

    return res.status(500).json({ message: 'Unexpected server error.' });
  });

  return app;
};
