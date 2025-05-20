import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlShortener, User } from 'generated/prisma';
import {
  CreateUrlShortenerDto,
  UpdateUrlShortenerDto,
} from './dto/url-shortener.prisma.dto';
import { UrlShortenerWithUser } from './types/url-shortener.types';

@Injectable()
export class UrlShortenerService {
  private readonly chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private readonly codeLength = Number(process?.env?.CODE_LENGTH) || 6;

  private generateCode(): string {
    let result = '';
    for (let i = 0; i < this.codeLength; i++) {
      const idx = Math.floor(Math.random() * this.chars.length);
      result += this.chars[idx];
    }
    return result;
  }

  private async generateUniqueCode(): Promise<string> {
    let code = this.generateCode();
    while (
      await prisma?.urlShortener.findFirst({
        where: {
          code,
          deletedAt: null,
        },
      })
    ) {
      code = this.generateCode();
    }

    return code;
  }
  async createUrlShortener(data: CreateUrlShortenerDto) {
    const code = await this.generateUniqueCode();

    return prisma?.urlShortener.create({
      data: {
        urlOriginal: data.urlOriginal,
        urlShort: process?.env?.URL + '/' + code,
        code,
        ...(data?.user?.id && {
          user: {
            connect: {
              id: data.user.id,
            },
          },
        }),
      },
    });
  }

  async findByCode(code: string): Promise<UrlShortener> {
    const url = await prisma?.urlShortener.findFirst({
      where: { code, deletedAt: null },
    });
    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    this.incrementClicks(url);

    return url;
  }

  async incrementClicks(url: UrlShortenerWithUser): Promise<boolean> {
    url.clicks = Number(url.clicks) + 1;
    const update = await prisma?.urlShortener.update({
      where: {
        id: url.id,
      },
      data: {
        clicks: url.clicks,
      },
    });

    return Boolean(update);
  }

  async listUrlsByUser(user: Pick<User, 'id'>): Promise<UrlShortener[]> {
    const urls = await prisma?.urlShortener.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return urls || [];
  }

  async verifyCanAccessUrl(
    url:
      | Pick<UrlShortenerWithUser, 'userId' | 'urlOriginal'>
      | Pick<UrlShortenerWithUser, 'userId' | 'code'>,
  ) {
    const verifyUrlExists = await prisma?.urlShortener.findFirst({
      where: {
        OR: [
          {
            ...('urlOriginal' in url && { urlOriginal: url.urlOriginal }),
          },
          {
            ...('code' in url && { code: url.code }),
          },
        ],
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });

    console.log({
      verifyUrlExists,
      url,
    });
    if (!verifyUrlExists) throw new NotFoundException('URL não encontrada');

    if (verifyUrlExists?.user?.id !== url?.userId)
      throw new ForbiddenException('Não autorizado');
  }
  async removeUrl(data: Pick<UrlShortenerWithUser, 'code' | 'userId'>) {
    const url = await prisma?.urlShortener.findFirst({
      where: {
        code: data.code,
      },
    });

    if (!url) throw new NotFoundException('URL não encontrada');

    if (!data?.userId) throw new NotFoundException('Usuário não informado');

    await this.verifyCanAccessUrl({
      urlOriginal: url.urlOriginal,
      userId: data.userId,
    });

    return prisma?.urlShortener.update({
      where: {
        id: url.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restoreUrl(data: Pick<UrlShortenerWithUser, 'code' | 'userId'>) {
    const url = await prisma?.urlShortener.findFirst({
      where: {
        code: data.code,
      },
    });

    if (!url) throw new NotFoundException('URL não encontrada');

    if (!data?.userId) throw new NotFoundException('Usuário não informado');

    return prisma?.urlShortener.update({
      where: {
        id: url.id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async updateUrl(url: UpdateUrlShortenerDto) {
    if (!url) throw new NotFoundException('URL não encontrada');

    if (!url?.user?.id) throw new NotFoundException('Usuário não informado');

    await this.verifyCanAccessUrl({
      code: url.code,
      userId: url?.user?.id,
    });

    const findedUrl = await prisma?.urlShortener.findFirst({
      where: {
        code: url.code,
      },
      select: {
        id: true,
      },
    });

    if (!findedUrl) throw new NotFoundException('URL não encontrada');

    url.id = findedUrl.id;

    return prisma?.urlShortener.update({
      where: {
        id: url.id,
      },
      data: {
        urlOriginal: url.novaUrl,
      },
    });
  }
}
