import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '../types';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateUserDto = req.body;
      const result = await this.authService.register(data);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginDto = req.body;
      const result = await this.authService.login(data);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
