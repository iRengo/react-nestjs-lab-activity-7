import {Body, Controller, Get, Patch, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {AuthGuard} from '../auth/auth.guard';
import {UserDto} from '../users/dto/user.dto';
import {AccountService} from './account.service';
import {UpdateAccountDto} from './dto/update-account.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

@ApiTags('Account')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiOkResponse({ description: 'Authenticated user profile', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getProfile(@Req() request: AuthenticatedRequest): Promise<UserDto> {
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    const profile = await this.accountService.getProfile(request.user.userId);
    return plainToInstance(UserDto, profile);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile details for the current user' })
  @ApiOkResponse({ description: 'Updated profile', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<UserDto> {
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    const profile = await this.accountService.updateProfile(request.user.userId, updateAccountDto);
    return plainToInstance(UserDto, profile);
  }
}
