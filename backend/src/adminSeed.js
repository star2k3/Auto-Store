import crypto from 'crypto';

let cachedAdminPassword = '';

export const resolveAdminPassword = () => {
  if (cachedAdminPassword) return cachedAdminPassword;

  if (process.env.ADMIN_PASSWORD) {
    cachedAdminPassword = process.env.ADMIN_PASSWORD;
    return cachedAdminPassword;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_PASSWORD must be set in production.');
  }

  cachedAdminPassword = crypto.randomBytes(12).toString('base64url');
  console.warn(`ADMIN_PASSWORD not set. Generated dev admin password: ${cachedAdminPassword}`);
  return cachedAdminPassword;
};
