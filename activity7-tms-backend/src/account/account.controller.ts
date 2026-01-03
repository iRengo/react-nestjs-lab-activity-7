import {Body, Controller, Get, Patch, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {AuthGuard} from '../auth/auth.guard';
import {AccountService} from './account.service';
import {UpdateAccountDto} from './dto/update-account.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  async getProfile(@Req() request: AuthenticatedRequest) {
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.accountService.getProfile(request.user.userId);
  }

  @Patch('me')
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.accountService.updateProfile(request.user.userId, updateAccountDto);
  }
}
