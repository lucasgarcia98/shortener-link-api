import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { UrlShortenerService } from './url-shortener/url-shortener.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlShortenerService: UrlShortenerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':code')
  async findByCode(@Param('code') code: string, @Res() res: Response) {
    try {
      const { urlOriginal = '' } =
        await this.urlShortenerService.findByCode(code);

      return res.redirect(urlOriginal);
    } catch (error) {
      throw new NotFoundException('URL nao encontrada');
    }
  }
}
