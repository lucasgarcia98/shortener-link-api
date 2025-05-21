import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginEntity, RefreshEntity } from './dto/auth.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
      decode: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if email or password is missing', async () => {
      await expect(service.signIn({} as LoginEntity)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.signIn({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('gerarToken', () => {
    it('should return access and refresh tokens', async () => {
      const result = await service.gerarToken({
        email: 'test@test.com',
        sub: '1',
      });
      expect(result).toEqual({ access_token: 'token', refresh_token: 'token' });
    });
  });

  describe('reautenticar', () => {
    it('should return new tokens', async () => {
      jest
        .spyOn(service, 'verificarRefreshToken')
        .mockResolvedValue({ email: 'test@test.com', sub: '1' });
      const result = await service.reautenticar({ refresh_token: 'token' });
      expect(result).toEqual({ access_token: 'token', refresh_token: 'token' });
    });
  });

  describe('verificarRefreshToken', () => {
    it('should throw NotFoundException if refresh token is missing', async () => {
      await expect(
        service.verificarRefreshToken({} as RefreshEntity),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      (jwtService.decode as jest.Mock).mockReturnValue(null);
      await expect(
        service.verificarRefreshToken({ refresh_token: 'token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
