import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlShortener, User } from '@prisma/client';
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

  public generateCode(): string {
    let result = '';
    for (let i = 0; i < this.codeLength; i++) {
      const idx = Math.floor(Math.random() * this.chars.length);
      result += this.chars[idx];
    }
    return result;
  }

  public async generateUniqueCode(): Promise<string> {
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
  async createUrlShortener(
    data: Pick<CreateUrlShortenerDto, 'urlOriginal'> & {
      user?: Partial<Pick<User, 'id'>>;
    },
  ) {
    const code = await this.generateUniqueCode();

    return await prisma?.urlShortener.create({
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

    if (!verifyUrlExists) throw new NotFoundException('URL não encontrada');

    if (verifyUrlExists?.user?.id !== url?.userId)
      throw new ForbiddenException('Não autorizado');
  }
  async removeUrl(data: Pick<UrlShortenerWithUser, 'id' | 'userId'>) {
    const url = await prisma?.urlShortener.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!url) throw new NotFoundException('URL não encontrada');

    if (!data?.userId) throw new NotFoundException('Usuário não informado');

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

  async updateUrl(
    url: Pick<UpdateUrlShortenerDto, 'id' | 'novaUrl'> & {
      user: Pick<User, 'id'>;
    },
  ) {
    if (!url) throw new NotFoundException('URL não encontrada');

    if (!url?.user?.id) throw new NotFoundException('Usuário não informado');

    if (!url?.id) throw new NotFoundException('ID nao informado');

    return await prisma?.urlShortener.update({
      where: {
        id: url.id,
      },
      data: {
        urlOriginal: url.novaUrl,
      },
    });
  }
}
