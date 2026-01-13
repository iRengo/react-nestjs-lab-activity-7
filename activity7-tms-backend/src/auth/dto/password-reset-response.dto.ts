import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetResponseDto {
  @ApiProperty({
    description: 'Human readable confirmation that a reset email was sent',
    example: 'A reset password has been sent to your email.',
  })
  message!: string;
}
