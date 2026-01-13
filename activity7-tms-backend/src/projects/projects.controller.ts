import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';
import {AuthGuard} from '../auth/auth.guard';
import {CreateProjectDto} from './dto/create-project.dto';
import {ProjectDto} from './dto/project.dto';
import {ProjectsService} from './projects.service';
import {UpdateProjectDto} from './dto/update-project.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiCreatedResponse({ description: 'Project created successfully', type: ProjectDto })
  @ApiBadRequestResponse({ description: 'Validation error or rule violation' })
  @ApiUnauthorizedResponse({ description: 'Missing authentication context' })
  async create(@Body() createProjectDto: CreateProjectDto, @Req() request: RequestWithUser): Promise<ProjectDto> {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    const project = await this.projectsService.create(createProjectDto, userId);
    return plainToInstance(ProjectDto, project);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  @ApiOkResponse({ description: 'Collection of projects', type: ProjectDto, isArray: true })
  async findAll(): Promise<ProjectDto[]> {
    const projects = await this.projectsService.findAll();
    return plainToInstance(ProjectDto, projects);
  }

  @Get('assigned/me')
  @ApiOperation({ summary: 'List projects assigned to the authenticated user' })
  @ApiOkResponse({ description: 'Projects assigned to the requesting user', type: ProjectDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing authentication context' })
  async findAssignedForCurrentUser(@Req() request: RequestWithUser): Promise<ProjectDto[]> {
    const userId = request.user?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException('Authenticated user context missing');
    }

    const projects = await this.projectsService.findAssignedToUser(userId);
    return plainToInstance(ProjectDto, projects);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  @ApiParam({ name: 'id', description: 'Project identifier', example: 87 })
  @ApiOkResponse({ description: 'Project found', type: ProjectDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async findOne(@Param('id', ParseIntPipe) projectId: number): Promise<ProjectDto> {
    const project = await this.projectsService.findOne(projectId);
    return plainToInstance(ProjectDto, project);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project identifier', example: 87 })
  @ApiOkResponse({ description: 'Updated project details', type: ProjectDto })
  @ApiBadRequestResponse({ description: 'Validation error or immutable project' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async update(@Param('id', ParseIntPipe) projectId: number, @Body() updateProjectDto: UpdateProjectDto): Promise<ProjectDto> {
    const project = await this.projectsService.update(projectId, updateProjectDto);
    return plainToInstance(ProjectDto, project);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project identifier', example: 87 })
  @ApiOkResponse({ description: 'Deletion acknowledgement', schema: { example: { deleted: true } } })
  @ApiNotFoundResponse({ description: 'Project not found' })
  remove(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }
}
