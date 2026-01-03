import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {MembersService} from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findById(id);
  }
}
