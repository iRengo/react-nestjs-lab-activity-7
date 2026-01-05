import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Project} from '../projects/entities/project.entity';
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

  async update(taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOne({where: {taskId}, relations: ['project']});

    if (!task) {
      throw new NotFoundException('Task not found');
    }

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
    return this.findOne(saved.taskId);
  }

  async remove(taskId: number): Promise<{deleted: boolean}> {
    const result = await this.tasksRepository.delete(taskId);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return {deleted: true};
  }
}
