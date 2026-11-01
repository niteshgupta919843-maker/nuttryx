import { createApp } from './app';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { productService } from './services/product.service';
import { slideService } from './services/slide.service';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();
  
  // Seed initial products and hero slides if DB empty
  await productService.seedIfEmpty();
  await slideService.seedIfEmpty();

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`
  🥜 =====================================
  🥜  NUTTRYX Backend Server Running!
  🥜  Port:        ${ENV.PORT}
  🥜  Environment: ${ENV.NODE_ENV}
  🥜  Database:    MongoDB (${ENV.MONGODB_URI})
  🥜  API Docs:    http://localhost:${ENV.PORT}/
  🥜  Health Check: http://localhost:${ENV.PORT}/api/health
  🥜 =====================================
  `);
  });
};

startServer();
