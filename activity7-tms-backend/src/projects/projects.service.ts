import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from './dto/update-project.dto';
import {Project} from './entities/project.entity';
import {User} from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, createdBy: number): Promise<Project> {
    const creator = await this.usersRepository.findOne({where: {userId: createdBy}});

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdByUser: creator,
    });

    const saved = await this.projectsRepository.save(project);
    return this.findOne(saved.projectId);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['createdByUser'],
      order: {createdAt: 'DESC'},
    });
  }

  async findOne(projectId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({where: {projectId}, relations: ['createdByUser']});

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(projectId: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectsRepository.findOne({where: {projectId}, relations: ['createdByUser']});

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(project, updateProjectDto);

    const saved = await this.projectsRepository.save(project);

    return this.findOne(saved.projectId);
  }

  async remove(projectId: number): Promise<{deleted: boolean}> {
    const result = await this.projectsRepository.delete(projectId);

    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return {deleted: true};
  }
}
