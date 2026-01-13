import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ProjectStatus } from '../entities/project.entity';

export class ProjectDto {
  @ApiProperty({ description: 'Primary key of the project', example: 87 })
  projectId!: number;

  @ApiProperty({ description: 'Human readable project title', example: 'Website Redesign Launch' })
  projectName!: string;

  @ApiPropertyOptional({ description: 'Narrative description of the project scope', example: 'Refreshes the marketing site with the new brand system.' })
  projectDescription?: string | null;

  @ApiPropertyOptional({ description: 'Planned start date', example: '2024-03-18' })
  startDate?: string | null;

  @ApiPropertyOptional({ description: 'Projected completion date', example: '2024-04-05' })
  endDate?: string | null;

  @ApiProperty({ description: 'Lifecycle status of the project', enum: ProjectStatus, example: ProjectStatus.ONGOING })
  status!: ProjectStatus;

  @ApiPropertyOptional({ description: 'Identifier of the user that created the project', example: 120045, nullable: true })
  createdBy?: number | null;

  @ApiPropertyOptional({ description: 'User that created the project', type: () => UserDto, nullable: true })
  createdByUser?: UserDto | null;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-02-01T09:30:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last updated timestamp', example: '2024-02-10T17:45:12.000Z' })
  updatedAt!: Date;
}
