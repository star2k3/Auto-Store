import { createApp } from './app.js';
import { connectDatabase } from './db.js';
import { seedMongoCars } from './store.js';

const app = createApp();
const port = Number(process.env.PORT) || 4000;

const start = async () => {
  await connectDatabase();
  await seedMongoCars();
  app.listen(port, () => {
    console.log(`Auto-Store API running at http://localhost:${port}`);
  });
};

start();
