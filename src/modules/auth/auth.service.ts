import bcrypt from 'bcryptjs';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';

import type {
  LoginDTO,
  AuthResponseDTO,
  JwtPayloadDTO,
  AuthDependencies,
} from './auth.types.js';

export interface IAuthService {
  login(data: LoginDTO): Promise<AuthResponseDTO>;
}

export class AuthService implements IAuthService {
  constructor(private dependencies: AuthDependencies) {}

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.dependencies.userRepository.findByLogin(data.login);

    if (!user) {
      throw new Error('Login or password invalid');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new Error('Login or password invalid');
    }

    const token = this.generateToken({
      sub: user.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(payload: JwtPayloadDTO): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const expiresIn: SignOptions['expiresIn'] =
      (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1d';

    return jwt.sign(payload, secret as Secret, {
      expiresIn,
    });
  }
}
