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
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  taskTitle!: string;

  @IsOptional()
  @IsString()
  taskDescription?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  assignedTo?: number | null;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsInt()
  @Min(1)
  projectId!: number;
}
