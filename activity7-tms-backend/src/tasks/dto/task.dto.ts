import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectDto } from '../../projects/dto/project.dto';
import { TaskPriority, TaskStatus } from './create-task.dto';

export class TaskDto {
  @ApiProperty({ description: 'Primary key of the task', example: 341 })
  taskId!: number;

  @ApiProperty({ description: 'Short actionable title', example: 'Draft UX copy for dashboard' })
  taskTitle!: string;

  @ApiPropertyOptional({ description: 'Additional instructions or acceptance criteria', example: 'Focus on onboarding tooltip copy and empty state messaging.' })
  taskDescription?: string | null;

  @ApiPropertyOptional({ description: 'User ID assigned to the task', example: 120102, nullable: true })
  assignedTo?: number | null;

  @ApiPropertyOptional({ description: 'Relative urgency indicator', enum: TaskPriority, example: TaskPriority.MEDIUM, nullable: true })
  priority?: TaskPriority | null;

  @ApiPropertyOptional({ description: 'Workflow status', enum: TaskStatus, example: TaskStatus.FOR_REVIEW, nullable: true })
  status?: TaskStatus | null;

  @ApiPropertyOptional({ description: 'Target completion date', example: '2024-03-22', nullable: true })
  dueDate?: string | null;

  @ApiProperty({ description: 'Identifier of the parent project', example: 87 })
  projectId!: number;

  @ApiPropertyOptional({ description: 'Populated project reference when requested with relations', type: () => ProjectDto, nullable: true })
  project?: ProjectDto;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-02-08T11:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last modification timestamp', example: '2024-02-11T09:25:42.000Z' })
  updatedAt!: Date;
}
