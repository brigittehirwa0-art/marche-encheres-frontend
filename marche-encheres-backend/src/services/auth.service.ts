import { UserRepository } from '../repositories/user.repository';
import { AppError, ConflictError } from '../utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginDto } from '../types';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const avatar = data.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      avatar,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);
    return { user: userWithoutPassword, token };
  }

  private generateToken(user: any): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
}
