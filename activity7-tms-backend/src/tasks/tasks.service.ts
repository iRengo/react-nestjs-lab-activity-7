import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Project, ProjectStatus} from '../projects/entities/project.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {Task} from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectsRepository.findOne({where: {projectId: createTaskDto.projectId}});

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: createTaskDto.status ?? 'pending',
      project,
    });

    const saved = await this.tasksRepository.save(task);
    await this.syncProjectAssignmentState(project.projectId);
    return this.findOne(saved.taskId);
  }

  async findAll(projectId?: number): Promise<Task[]> {
    const where = projectId ? {projectId} : undefined;

    return this.tasksRepository.find({
      where,
      relations: ['project'],
      order: {createdAt: 'DESC'},
    });
  }

  async findOne(taskId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({where: {taskId}, relations: ['project']});

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findAssignedToUser(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {assignedTo: userId},
      relations: ['project'],
      order: {createdAt: 'DESC'},
    });
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOne({where: {taskId}, relations: ['project']});

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const originalProjectId = task.projectId;

    if (updateTaskDto.projectId && updateTaskDto.projectId !== task.projectId) {
      const updatedProject = await this.projectsRepository.findOne({where: {projectId: updateTaskDto.projectId}});

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      task.project = updatedProject;
      task.projectId = updatedProject.projectId;
    }

    if (updateTaskDto.assignedTo === null) {
      throw new BadRequestException('assignedTo cannot be null. Omit the field instead.');
    }

    Object.assign(task, updateTaskDto);

    const saved = await this.tasksRepository.save(task);
    await this.syncProjectAssignmentState(saved.projectId);

    if (originalProjectId !== saved.projectId) {
      await this.syncProjectAssignmentState(originalProjectId);
    }

    return this.findOne(saved.taskId);
  }

  async remove(taskId: number): Promise<{deleted: boolean}> {
    const task = await this.tasksRepository.findOne({where: {taskId}});

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.remove(task);
    await this.syncProjectAssignmentState(task.projectId);

    return {deleted: true};
  }

  private async syncProjectAssignmentState(projectId: number): Promise<void> {
    const project = await this.projectsRepository.findOne({where: {projectId}});

    if (!project) {
      return;
    }

    const assignedCount = await this.tasksRepository
      .createQueryBuilder('task')
      .where('task.project_id = :projectId', {projectId})
      .andWhere('task.assigned_to IS NOT NULL')
      .andWhere('task.assigned_to > 0')
      .getCount();

    if (assignedCount > 0) {
      if (project.status !== ProjectStatus.ONGOING) {
        project.status = ProjectStatus.ONGOING;
        await this.projectsRepository.save(project);
      }
      return;
    }

    if (project.status === ProjectStatus.COMPLETED) {
      return;
    }

    if (project.status !== ProjectStatus.PENDING) {
      project.status = ProjectStatus.PENDING;
      await this.projectsRepository.save(project);
    }
  }
}
