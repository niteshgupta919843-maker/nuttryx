import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthenticatedUser {
  id: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Verifies JWT token if present. Continues even if not present, but populates req.user if valid.
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
  } catch {
    // invalid token, leave user undefined
  }
  next();
};

/**
 * Requires a valid authenticated user session.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please log in again.'
    });
  }
};

/**
 * Requires admin privileges via either:
 * 1. An authenticated JWT with role === 'admin'
 * 2. Or a valid x-admin-secret header matching ENV.ADMIN_SECRET
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const adminSecretHeader = req.headers['x-admin-secret'] as string | undefined;
  if (adminSecretHeader && adminSecretHeader === ENV.ADMIN_SECRET) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    // Check direct secret bearer token
    if (token === ENV.ADMIN_SECRET) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
      if (decoded.role === 'admin') {
        req.user = decoded;
        return next();
      }
    } catch {
      // invalid token
    }
  }

  res.status(403).json({
    success: false,
    message: 'Access denied: Admin credentials required.'
  });
};

