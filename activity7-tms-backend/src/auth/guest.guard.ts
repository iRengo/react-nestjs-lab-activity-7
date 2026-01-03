import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization: string | undefined = request.headers?.authorization;

    if (!authorization) {
      return true;
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return true;
    }

    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') ?? 'change-me',
      });
      throw new ForbiddenException('You are already signed in.');
    } catch (error) {
      return true;
    }
  }
}
