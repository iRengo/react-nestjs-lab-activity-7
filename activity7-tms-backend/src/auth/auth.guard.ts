import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard as PassportAuthGuard} from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    if (err || !user) {
      throw err instanceof UnauthorizedException
        ? err
        : new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
