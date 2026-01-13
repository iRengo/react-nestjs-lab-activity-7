import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'System generated identifier', example: 120045 })
  userId!: number;

  @ApiProperty({ description: 'Given name of the user', example: 'Jordan' })
  firstName!: string;

  @ApiProperty({ description: 'Family name of the user', example: 'Rivera' })
  lastName!: string;

  @ApiProperty({ description: 'Primary email address', example: 'jordan.rivera@example.com' })
  email!: string;

  @ApiProperty({ description: 'Role controlling authorization scopes', example: 'admin' })
  role!: string;

  @ApiProperty({ description: 'Lifecycle status flag', example: 'active' })
  status!: string;

  @ApiProperty({ description: 'Timestamp when the user was created', example: '2024-01-12T08:15:30.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Timestamp of the latest update', example: '2024-01-25T14:02:10.000Z' })
  updatedAt!: Date;
}
