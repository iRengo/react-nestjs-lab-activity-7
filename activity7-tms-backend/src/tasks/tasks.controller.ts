import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {AuthGuard} from '../auth/auth.guard';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskDto} from './dto/task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {TasksService} from './tasks.service';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    role?: string;
  };
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiCreatedResponse({ description: 'Task created successfully', type: TaskDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const task = await this.tasksService.create(createTaskDto);
    return plainToInstance(TaskDto, task);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks', description: 'Returns all tasks or filters by project when projectId is provided.' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Limits results to a specific project', example: '87' })
  @ApiOkResponse({ description: 'Collection of tasks', type: TaskDto, isArray: true })
  async findAll(@Query('projectId') projectId?: string): Promise<TaskDto[]> {
    if (projectId === undefined || projectId === null || projectId === '') {
      const tasks = await this.tasksService.findAll();
      return plainToInstance(TaskDto, tasks);
    }

    const parsed = Number(projectId);

    if (Number.isNaN(parsed) || parsed < 1) {
      throw new BadRequestException('Invalid projectId');
    }

    const tasks = await this.tasksService.findAll(parsed);
    return plainToInstance(TaskDto, tasks);
  }

  @Get('assigned/me')
  @ApiOperation({ summary: 'Tasks assigned to the authenticated user' })
  @ApiOkResponse({ description: 'List of tasks assigned to the current user', type: TaskDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing authentication context' })
  async findAssignedToCurrentUser(@Req() request: RequestWithUser): Promise<TaskDto[]> {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    const tasks = await this.tasksService.findAssignedToUser(userId);
    return plainToInstance(TaskDto, tasks);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details' })
  @ApiParam({ name: 'id', description: 'Task identifier', example: 341 })
  @ApiOkResponse({ description: 'Task found', type: TaskDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async findOne(@Param('id', ParseIntPipe) taskId: number): Promise<TaskDto> {
    const task = await this.tasksService.findOne(taskId);
    return plainToInstance(TaskDto, task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task identifier', example: 341 })
  @ApiOkResponse({ description: 'Updated task details', type: TaskDto })
  @ApiBadRequestResponse({ description: 'Validation error or forbidden state change' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async update(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: RequestWithUser,
  ): Promise<TaskDto> {
    const task = await this.tasksService.update(taskId, updateTaskDto, request.user);
    return plainToInstance(TaskDto, task);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task identifier', example: 341 })
  @ApiOkResponse({ description: 'Deletion acknowledgement', schema: { example: { deleted: true } } })
  @ApiNotFoundResponse({ description: 'Task not found' })
  remove(@Param('id', ParseIntPipe) taskId: number) {
    return this.tasksService.remove(taskId);
  }
}
