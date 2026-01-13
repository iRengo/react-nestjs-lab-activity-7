import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString, Matches} from 'class-validator';

export class UpdateAccountDto {
  @ApiPropertyOptional({ description: 'Updated first name', example: 'Jordan' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Updated last name', example: 'Rivera' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'New email address', example: 'jordan.rivera@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password that meets complexity rules',
    example: 'TeamLead2024',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    { message: 'Password must be at least 8 characters and include uppercase, lowercase, and a digit.' })
  password?: string;
}
