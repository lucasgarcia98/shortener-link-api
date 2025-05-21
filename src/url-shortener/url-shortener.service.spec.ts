/* eslint-disable @typescript-eslint/no-unused-expressions */
import { faker } from '@faker-js/faker/.';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UrlShortener } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import prisma from './../infra/prisma';
import { UrlShortenerService } from './url-shortener.service';
prisma;
const prismaMock = mockDeep<PrismaClient>();

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: PrismaClient, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    mockReset(prismaMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCode', () => {
    it('should generate a code with 6 characters', () => {
      const code = service.generateCode();
      expect(code.length).toBe(6);
    });
  });

  describe('generateUniqueCode', () => {
    it('should generate a unique code', async () => {
      prismaMock.urlShortener.findFirst.mockResolvedValue(null);
      const code1 = await service.generateUniqueCode();
      const code2 = await service.generateUniqueCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('createUrlShortener', () => {
    it('should create a new url shortener', async () => {
      const data = {
        urlOriginal: faker.internet.url(),
      };
      const code = faker.string.alphanumeric({ length: 6 });

      prismaMock.urlShortener.create.mockResolvedValue({
        id: faker.string.uuid(),
        urlOriginal: faker.internet.url(),
        urlShort: process.env.URL + '/' + code,
        clicks: 0,
        code,
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        userId: null,
      });
      const url = await service.createUrlShortener(data);

      expect(url).toEqual(
        expect.objectContaining<UrlShortener>({
          id: expect.any(String),
          urlOriginal: expect.any(String),
          urlShort: expect.any(String),
          clicks: 0,
          code: expect.any(String),
          createdAt: expect.any(Date),
          deletedAt: null,
          updatedAt: expect.any(Date),
          userId: null,
        }),
      );
    });
  });

  describe('findByCode', () => {
    it('should find a url shortener by code', async () => {
      const url = {
        id: expect.any(String),
        urlOriginal: expect.any(String),
        urlShort: expect.any(String),
        clicks: expect.any(Number),
        code: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        userId: null,
      };

      const urlRegistered = await service.createUrlShortener({
        urlOriginal: faker.internet.url(),
      });

      prismaMock.urlShortener.findFirst.mockResolvedValue(url);
      const foundUrl = await service.findByCode(urlRegistered.code);
      expect(foundUrl).toEqual(url);
    });
  });

  describe('listUrlsByUser', () => {
    it('should return a list of urls', async () => {
      const urls = await service.listUrlsByUser({ id: faker.string.uuid() });
      expect(urls).toEqual(expect.arrayContaining<UrlShortener>([]));
    });
  });
  describe('verifyCanAccessUrl', () => {
    it('should throw an error if the user is not authorized', async () => {
      const data = {
        urlOriginal: 'https://www.google.com',
        user: { id: 1 },
      };

      const url = {
        id: expect.any(String),
        urlOriginal: expect.any(String),
        urlShort: expect.any(String),
        clicks: expect.any(Number),
        code: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        userId: null,
      };

      prismaMock.urlShortener.findFirst.mockResolvedValue(url);
      await expect(
        service.verifyCanAccessUrl({
          urlOriginal: 'https://www.google.com',
          userId: faker.string.uuid(),
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
