import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'Id precisa ser uma string',
  })
  id?: string | undefined;

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
    message: 'Password precisa ser um texto',
  })
  @Length(8, 20, {
    message: 'Password precisa ter entre 8 e 20 caracteres',
  })
  password: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'CreatedAt precisa ser uma string',
  })
  createdAt?: string | Date | undefined;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'UpdatedAt precisa ser uma string',
  })
  updatedAt?: string | Date | undefined;
}

export class UpdateUserDto extends CreateUserDto {
  declare id: string | undefined;
}
