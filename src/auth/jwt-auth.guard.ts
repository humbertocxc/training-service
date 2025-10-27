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
      const publicKey = this.config.get<string>('JWT_PUBLIC_KEY');
      if (!publicKey) {
        throw new UnauthorizedException('JWT public key not configured');
      }
      const payload = verify(token, publicKey as Secret, {
        algorithms: ['RS256'],
      }) as { sub?: string; email?: string };
      request.user = {
        externalUserId: payload.sub,
        email: payload.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}

declare module 'express' {
  interface Request {
    user?: { externalUserId?: string; email?: string };
  }
}
