import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {AuthService} from './auth.service';
import {AuthResponseDto} from './dto/auth-response.dto';
import {ForgotPasswordDto} from './dto/forgot-password.dto';
import {LoginDto} from './dto/login.dto';
import {PasswordResetResponseDto} from './dto/password-reset-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive a JWT' })
  @ApiOkResponse({ description: 'Authentication successful', type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const payload = await this.authService.login(loginDto);
    return plainToInstance(AuthResponseDto, payload);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger password reset email' })
  @ApiOkResponse({ description: 'Password reset email sent', type: PasswordResetResponseDto })
  @ApiNotFoundResponse({ description: 'Email not associated with an account' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async forgotPassword(@Body() payload: ForgotPasswordDto): Promise<PasswordResetResponseDto> {
    await this.authService.forgotPassword(payload.email.trim().toLowerCase());

    return plainToInstance(PasswordResetResponseDto, {
      message: 'A reset password has been sent to your email.',
    });
  }
}
