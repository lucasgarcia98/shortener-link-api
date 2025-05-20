import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginEntity, RefreshEntity } from './dto/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() data: LoginEntity) {
    return this.authService.signIn(data);
  }

  @Post('refresh')
  reautenticar(@Body() body: RefreshEntity) {
    return this.authService.reautenticar(body);
  }
}
