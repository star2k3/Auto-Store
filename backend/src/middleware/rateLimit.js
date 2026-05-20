import rateLimit from 'express-rate-limit';

const createLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });

export const authLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});

export const checkoutLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  message: { message: 'Too many checkout requests. Please try again later.' }
});

export const accountLimiter = createLimiter({
  windowMs: 2 * 60 * 1000,
  limit: 60,
  message: { message: 'Too many requests. Please try again later.' }
});

export const adminLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
  message: { message: 'Too many admin requests. Please try again later.' }
});
