import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {AuthGuard} from '../auth/auth.guard';
import {CreateProjectDto} from './dto/create-project.dto';
import {ProjectsService} from './projects.service';
import {UpdateProjectDto} from './dto/update-project.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() request: RequestWithUser) {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('assigned/me')
  findAssignedForCurrentUser(@Req() request: RequestWithUser) {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    return this.projectsService.findAssignedToUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectsService.findOne(projectId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) projectId: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(projectId, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }
}
