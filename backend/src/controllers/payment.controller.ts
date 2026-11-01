import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';

export class PaymentController {
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, receipt, notes } = req.body;
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid order amount is required'
        });
        return;
      }

      const order = await paymentService.createOrder({ amount, receipt, notes });
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        res.status(400).json({
          success: false,
          message: 'Missing required payment verification parameters'
        });
        return;
      }

      const result = paymentService.verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed. Invalid signature.'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  getConfig(_req: Request, res: Response): void {
    const config = paymentService.getConfig();
    res.status(200).json({
      success: true,
      data: config
    });
  }
}

export const paymentController = new PaymentController();

