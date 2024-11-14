import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';

@Controller('auth')
@TransformDTO(ResponseAuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInAuth: SignInAuthDto) {
    return this.authService.signIn(signInAuth);
  }
}
