import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  CreateUrlShortenerDto,
  UpdateUrlShortenerDto,
} from './dto/url-shortener.prisma.dto';
import { UrlShortenerService } from './url-shortener.service';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  createUrlShortener(@Body() data: CreateUrlShortenerDto, @Req() req: Request) {
    const user = req?.user;

    if (user) {
      data.user = {
        id: String(user['userId']),
      };
    }

    return this.urlShortenerService.createUrlShortener({
      urlOriginal: data.urlOriginal,
      ...(data.user && { user: data.user }),
    });
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  listUrlsByUser(@Req() req: Request) {
    const user = req?.user;

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.urlShortenerService.listUrlsByUser({
      id: user['userId'],
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUrl(
    @Param('id') id: string,
    @Body() data: UpdateUrlShortenerDto,
    @Req() req: Request,
  ) {
    if (!req.user) return;
    const user = req.user;

    return this.urlShortenerService.updateUrl({
      id,
      novaUrl: data.novaUrl,
      user: {
        id: user['userId'],
      },
    });
  }

  @Get('restore/:code')
  @UseGuards(JwtAuthGuard)
  restoreUrl(@Param('code') code: string, @Req() req: Request) {
    const user = req?.user;

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.urlShortenerService.restoreUrl({
      code,
      userId: user['userId'],
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeUrl(@Param('id') id: string, @Req() req: Request) {
    const user = req?.user;

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.urlShortenerService.removeUrl({ id, userId: user['userId'] });
  }
}
