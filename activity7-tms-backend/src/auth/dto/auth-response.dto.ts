import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT bearer token to include in the Authorization header', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ description: 'Sanitized user object associated with the token', type: () => UserDto })
  user!: UserDto;
}
