import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email address used for login', example: 'jordan.rivera@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Plain text password matching the registered account', example: 'TeamLead2024' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
