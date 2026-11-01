import { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';

/**
 * Built-in high-performance Gzip compression middleware.
 * Compresses JSON payloads > 1KB using native Node.js zlib without external dependencies.
 */
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const acceptEncoding = (req.headers['accept-encoding'] as string) || '';
  if (!acceptEncoding.includes('gzip')) {
    next();
    return;
  }

  const originalSend = res.send.bind(res);

  res.send = function (body: any): Response {
    if (typeof body === 'string' && body.length > 1024) {
      res.setHeader('Content-Encoding', 'gzip');
      res.removeHeader('Content-Length');

      zlib.gzip(Buffer.from(body), (err, compressed) => {
        if (err) {
          res.removeHeader('Content-Encoding');
          return originalSend(body);
        }
        res.setHeader('Content-Length', compressed.length);
        return originalSend(compressed);
      });
      return res;
    }
    return originalSend(body);
  };

  next();
};

