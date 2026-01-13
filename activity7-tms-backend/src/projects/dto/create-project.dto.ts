import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';
import {ProjectStatus} from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Human readable project title shown across the app',
    example: 'Website Redesign Launch',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  projectName!: string;

  @ApiPropertyOptional({
    description: 'Context or scope for the initiative',
    example: 'Refreshes the marketing site with the new brand system.',
  })
  @IsOptional()
  @IsString()
  projectDescription?: string;

  @ApiPropertyOptional({
    description: 'ISO8601 start date for the project plan',
    example: '2024-03-18',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'ISO8601 target completion date',
    example: '2024-04-05',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Lifecycle status of the project',
    enum: ProjectStatus,
    example: ProjectStatus.PENDING,
    default: ProjectStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
