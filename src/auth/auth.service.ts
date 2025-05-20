import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthEntity, LoginEntity, RefreshEntity } from './dto/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: LoginEntity) {
    const { email, password } = data;
    if (!email || !password) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou senha incorreta');
    }

    const validator = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (validator) {
      const payload: AuthEntity = { email: user.email, sub: user.id };
      const { access_token, refresh_token } = await this.gerarToken(payload);
      return {
        access_token,
        refresh_token,
      };
    }

    throw new UnauthorizedException('Usuário ou senha inválidos');
  }

  async gerarToken(payload: AuthEntity) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async reautenticar(body: RefreshEntity) {
    const payload: AuthEntity = await this.verificarRefreshToken(body);
    return this.gerarToken(payload);
  }

  async verificarRefreshToken(body: RefreshEntity) {
    const refreshToken = body.refresh_token;

    if (!refreshToken) {
      throw new NotFoundException('Usuário não encontrado ou senha incorreta');
    }

    const refresh = this.jwtService.decode(refreshToken);

    if (!refresh) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const { email } = refresh;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou senha incorreta');
    }

    try {
      this.jwtService.verify(refreshToken);

      return {
        email: user.email,
        sub: user.id,
      };
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Assinatura Inválida');
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }
      throw new UnauthorizedException(err.name);
    }
  }
}
