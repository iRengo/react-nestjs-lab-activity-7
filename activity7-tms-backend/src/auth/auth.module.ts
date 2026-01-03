import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule, JwtModuleOptions} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {UsersModule} from '../users/users.module';
import {AuthController} from './auth.controller';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';
import {GuestGuard} from './guest.guard';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const rawExpiresIn = configService.get<string>('JWT_EXPIRES_IN');
        const numericExpiration = rawExpiresIn ? Number(rawExpiresIn) : undefined;
        const expiresIn = rawExpiresIn && numericExpiration !== undefined && !Number.isNaN(numericExpiration)
          ? numericExpiration
          : 3600;

        return {
          secret: configService.get<string>('JWT_SECRET') ?? 'change-me',
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard, GuestGuard],
  exports: [AuthService, AuthGuard, GuestGuard],
})
export class AuthModule {}
