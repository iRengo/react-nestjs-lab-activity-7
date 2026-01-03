import {Type} from 'class-transformer';
import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches} from 'class-validator';

export class CreateUserDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    { message: 'Password must be at least 8 characters and include uppercase, lowercase, and a digit.' })
  password: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
