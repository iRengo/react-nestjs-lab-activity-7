import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserDto} from './dto/user.dto';
import {UsersService} from './users.service';

@ApiTags('Users')
@Controller('user_tms')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user', description: 'Registers a new user account in the Task Management System.' })
  @ApiCreatedResponse({ description: 'User created successfully', type: UserDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'Duplicate email or user ID' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(UserDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List users', description: 'Returns all users or filters by role when provided.' })
  @ApiQuery({ name: 'role', required: false, description: 'Limits the result to users with the specified role', example: 'admin' })
  @ApiOkResponse({ description: 'List of users', type: UserDto, isArray: true })
  async findAll(@Query('role') role?: string): Promise<UserDto[]> {
    const users = await this.usersService.findAll(role);
    return plainToInstance(UserDto, users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', description: 'User identifier', example: 120045 })
  @ApiOkResponse({ description: 'User found', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.usersService.findOneById(id);
    return plainToInstance(UserDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User identifier', example: 120045 })
  @ApiOkResponse({ description: 'Updated user record', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToInstance(UserDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User identifier', example: 120045 })
  @ApiNoContentResponse({ description: 'User removed successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
