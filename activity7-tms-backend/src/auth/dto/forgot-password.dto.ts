import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Account email that will receive reset instructions', example: 'jordan.rivera@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
