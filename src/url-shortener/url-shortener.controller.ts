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
        id: user['userId'],
      };
    }

    return this.urlShortenerService.createUrlShortener(data);
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

  @Patch(':code')
  @UseGuards(JwtAuthGuard)
  updateUrl(
    @Param('code') code: string,
    @Body() data: UpdateUrlShortenerDto,
    @Req() req: Request,
  ) {
    const user = req?.user;

    data.code = code;
    if (user) {
      data.user = {
        id: user['userId'],
      };
    }

    return this.urlShortenerService.updateUrl(data);
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

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  removeUrl(@Param('code') code: string, @Req() req: Request) {
    const user = req?.user;

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.urlShortenerService.removeUrl({ code, userId: user['userId'] });
  }
}
