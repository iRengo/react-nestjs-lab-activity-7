import {IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';
import {ProjectStatus} from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  projectName!: string;

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
