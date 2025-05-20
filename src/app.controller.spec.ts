import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Página inicial!"', () => {
      expect(appController.getHello()).toBe('Página inicial!');
    });

    it('not should return "Página inicial!"', () => {
      expect(appController.getHello()).not.toBe('Inicio');
    });
  });
});
