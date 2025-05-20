import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthEntity {
  email: string;
  sub: string;
}

export class LoginEntity {
  @ApiProperty({
    required: true,
    type: String,
    format: 'email',
  })
  @IsEmail(
    {},
    {
      message: 'Email precisa ser válido',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'password',
  })
  @IsString({
    message: 'Password precisa ser informado',
  })
  password: string;
}

export class RefreshEntity {
  refresh_token: string;
}
