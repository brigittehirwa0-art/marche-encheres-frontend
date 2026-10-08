import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service';
import { PlaceBidDto } from '../types';

export class BidController {
  constructor(private bidService: BidService) {}

  getByProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const bids = await this.bidService.findByProduct(productId);
      res.status(200).json({
        success: true,
        data: bids,
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
      const bids = await this.bidService.findByUser(userId);
      res.status(200).json({
        success: true,
        data: bids,
      });
    } catch (error) {
      next(error);
    }
  };

  placeBid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const data: PlaceBidDto = req.body;
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const bid = await this.bidService.placeBid(productId, data, userId, userName || 'Anonymous');
      res.status(201).json({
        success: true,
        data: bid,
      });
    } catch (error) {
      next(error);
    }
  };
}
