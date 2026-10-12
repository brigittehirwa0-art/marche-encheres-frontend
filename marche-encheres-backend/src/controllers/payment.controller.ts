import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.paymentService.findAll();
      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  };

  getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }
      const payments = await this.paymentService.findByUser(userId);
      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  };

  simulatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const payment = await this.paymentService.simulatePayment(productId, userId, userName || 'Anonymous');
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  awardBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, bidId } = req.params;
      const sellerId = (req as any).user?.id;
      
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const payment = await this.paymentService.awardBid(productId, bidId, sellerId);
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };
}
