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
import {AuthGuard} from '../auth/auth.guard';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {TasksService} from './tasks.service';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    if (projectId === undefined || projectId === null || projectId === '') {
      return this.tasksService.findAll();
    }

    const parsed = Number(projectId);

    if (Number.isNaN(parsed) || parsed < 1) {
      throw new BadRequestException('Invalid projectId');
    }

    return this.tasksService.findAll(parsed);
  }

  @Get('assigned/me')
  findAssignedToCurrentUser(@Req() request: RequestWithUser) {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    return this.tasksService.findAssignedToUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) taskId: number) {
    return this.tasksService.findOne(taskId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) taskId: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(taskId, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) taskId: number) {
    return this.tasksService.remove(taskId);
  }
}
