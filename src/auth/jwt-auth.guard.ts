import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = String(authHeader).replace('Bearer ', '');

    try {
      const secret = this.config.get<string>('JWT_SECRET');
      if (!secret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      const payload = verify(token, secret as Secret, {
        algorithms: ['HS256'],
      }) as { sub?: string; email?: string; name?: string; role?: string };

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        externalUserId: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}

declare module 'express' {
  interface Request {
    user?: {
      externalUserId?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }
}
