import {Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {MemberDto} from './dto/member.dto';
import {MembersService} from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a member profile',
    description: 'Returns the directory profile for the member that matches the provided numeric identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric identifier of the requested member',
    example: 42,
  })
  @ApiOkResponse({
    description: 'Member record found',
    type: MemberDto,
  })
  @ApiNotFoundResponse({ description: 'Member ID not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MemberDto> {
    const member = await this.membersService.findById(id);
    return plainToInstance(MemberDto, member);
  }
}
