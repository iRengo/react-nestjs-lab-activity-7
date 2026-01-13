import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsPositive, IsString, Length } from 'class-validator';

export class MemberDto {
  @ApiProperty({
    description: 'Unique identifier for the member',
    example: 42,
  })
  @IsInt()
  @IsPositive()
  id!: number;

  @ApiProperty({
    description: 'Given name as stored in the directory',
    example: 'Avery',
  })
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @ApiProperty({
    description: 'Family name as stored in the directory',
    example: 'Nguyen',
  })
  @IsString()
  @Length(1, 100)
  lastName!: string;

  @ApiProperty({
    description: 'Primary email address used for notifications',
    example: 'avery.nguyen@example.com',
  })
  @IsEmail()
  email!: string;
}
