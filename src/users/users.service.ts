import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/users.prisma.dto';

@Injectable()
export class UsersService {
  async create(data: CreateUserDto) {
    data.password = hashSync(data.password, genSaltSync());

    const emailExists = await prisma?.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    });

    if (emailExists) {
      throw new BadRequestException('Email ja cadastrado');
    }

    const user = await prisma?.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  async update(data: UpdateUserDto) {
    if (!data.id) {
      throw new BadRequestException('Id nao informado');
    }

    const user = await prisma?.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  async findAll() {
    const users = await prisma?.user.findMany({
      where: {
        deletedAt: null,
      },
    });

    return users;
  }

  async findOne(id: string) {
    const user = await prisma?.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }
    return user;
  }

  async remove(id: string) {
    const user = await prisma?.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await prisma?.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
    return user;
  }

  async validatePassword(password: string, userPassword: string) {
    const isMatch: boolean = await compare(password, userPassword);

    return isMatch;
  }
}
