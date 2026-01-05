import {IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min} from 'class-validator';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
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
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsInt()
  @Min(1)
  projectId!: number;
}
