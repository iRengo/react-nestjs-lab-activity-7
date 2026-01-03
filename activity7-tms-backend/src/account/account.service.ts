import {Injectable} from '@nestjs/common';
import {UpdateUserDto} from '../users/dto/update-user.dto';
import {UsersService} from '../users/users.service';
import {UpdateAccountDto} from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(userId: number) {
    const user = await this.usersService.findOneById(userId);
    const {password, ...safeUser} = user;
    return safeUser;
  }

  async updateProfile(userId: number, updateAccountDto: UpdateAccountDto) {
    const payload: UpdateUserDto = updateAccountDto as UpdateUserDto;
    const updatedUser = await this.usersService.update(userId, payload);
    const {password, ...safeUser} = updatedUser;
    return safeUser;
  }
}
