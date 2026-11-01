import { Request, Response, NextFunction } from 'express';

export const validateOrderInput = (req: Request, res: Response, next: NextFunction): void => {
  const { customer, items, total } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    res.status(400).json({
      success: false,
      message: 'Customer name, phone, and address are required'
    });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
    return;
  }

  if (typeof total !== 'number' || total <= 0) {
    res.status(400).json({
      success: false,
      message: 'Invalid order total'
    });
    return;
  }

  next();
};

export const validateSampleInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, phone, address, pincode } = req.body;

  if (!name || !phone || !address || !pincode) {
    res.status(400).json({
      success: false,
      message: 'Name, phone, address, and pincode are required for sample claim'
    });
    return;
  }

  next();
};

