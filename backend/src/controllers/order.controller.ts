import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer, items, subtotal, shipping, total, paymentMethod, paymentStatus, paymentId, razorpayOrderId } = req.body;
      const order = await orderService.createOrder({
        customer,
        items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        paymentStatus,
        paymentId,
        razorpayOrderId
      });
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: order.id,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await orderService.updateOrderStatus(id, status);
      res.status(200).json({
        success: !!updated,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = (req.params.query || req.params.id || '').trim();
      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Please provide an Order ID or Phone number to track.'
        });
        return;
      }

      const order = await orderService.trackOrder(query);
      if (!order) {
        res.status(404).json({
          success: false,
          message: `No order found for "${query}". Please check your Order ID (e.g. NUTX-XXXXXX) or mobile number.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async createSampleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, phone, email, address, city, pincode, selectedFlavour } = req.body;
      const sample = await orderService.createSampleRequest({
        name,
        phone,
        email,
        address,
        city,
        pincode,
        selectedFlavour
      });
      res.status(201).json({
        success: true,
        message: 'Free sample request received successfully! We will dispatch it shortly.',
        data: sample
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSampleRequests(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const samples = await orderService.getAllSampleRequests();
      res.status(200).json({
        success: true,
        count: samples.length,
        data: samples
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSampleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['pending', 'dispatched', 'delivered'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid sample status. Allowed values: pending, dispatched, delivered'
        });
        return;
      }
      const updated = await orderService.updateSampleStatus(id, status);
      res.status(200).json({
        success: !!updated,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
