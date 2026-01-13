import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min} from 'class-validator';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  FOR_REVIEW = 'for review',
  COMPLETED = 'completed',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Short actionable task title',
    example: 'Draft UX copy for dashboard',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  taskTitle!: string;

  @ApiPropertyOptional({
    description: 'Detailed instructions or acceptance criteria',
    example: 'Focus on onboarding tooltip copy and empty state messaging.',
  })
  @IsOptional()
  @IsString()
  taskDescription?: string;

  @ApiPropertyOptional({
    description: 'User ID assigned to complete the task',
    example: 120102,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assignedTo?: number | null;

  @ApiPropertyOptional({
    description: 'Relative urgency of the task',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Workflow status',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Target completion date',
    example: '2024-03-22',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    description: 'Project identifier the task belongs to',
    example: 87,
  })
  @IsInt()
  @Min(1)
  projectId!: number;
}
