import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { UrlShortenerCreateEntity } from './url-shortener.prisma.entity';

export class CreateUrlShortenerDto extends UrlShortenerCreateEntity {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'code precisa ser uma string',
  })
  declare code: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  declare clicks?: number | undefined;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  declare id?: string | undefined;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString({
    message: 'urlOriginal precisa ser uma string',
  })
  declare urlOriginal: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  declare urlShort: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'createdAt precisa ser uma string',
  })
  declare createdAt?: string | Date | undefined;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'updatedAt precisa ser uma string',
  })
  declare updatedAt?: string | Date | undefined;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'deletedAt precisa ser uma string',
  })
  declare deletedAt?: string | Date | null | undefined;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  declare userId?: string | null | undefined;

  declare user?: Partial<Prisma.UserUncheckedCreateInput> | undefined;
}

export class UpdateUrlShortenerDto extends CreateUrlShortenerDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  declare urlOriginal: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString({
    message: 'novaUrl precisa ser uma string',
  })
  novaUrl: string;
}
