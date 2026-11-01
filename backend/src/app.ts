import express, { Application } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { compressionMiddleware } from './middleware/compression';

export const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(compressionMiddleware);
  const allowedOrigins = [
    ENV.CLIENT_URL,
    'http://localhost:3000',
    'https://nuttryx.vercel.app'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'NUTTRYX API',
      version: '1.0.0',
      description: 'Pure Peanut Butter E-commerce API',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        orders: '/api/orders',
        samples: '/api/samples'
      }
    });
  });

  // Mount API
  app.use('/api', apiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

