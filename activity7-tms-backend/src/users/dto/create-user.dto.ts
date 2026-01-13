import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Numeric identifier that matches the employee badge or HR system ID',
    example: 120045,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({
    description: 'Given name of the user',
    example: 'Jordan',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    description: 'Family name of the user',
    example: 'Rivera',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'Primary email address used for login and notifications',
    example: 'jordan.rivera@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Password must include uppercase, lowercase, and numeric characters',
    example: 'TeamLead2024',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    { message: 'Password must be at least 8 characters and include uppercase, lowercase, and a digit.' })
  password!: string;

  @ApiPropertyOptional({
    description: 'Role controls authorization scopes',
    example: 'admin',
    default: 'user',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Lifecycle status flag used to disable access',
    example: 'active',
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
