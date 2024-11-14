import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { CreateArtistDto } from './dto/create-artist.dto';

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

  @Post('/sign-up-artist')
  @HttpCode(HttpStatus.OK)
  signUpArtist(@Body() createAuthDto: CreateArtistDto) {
    return this.authService.signUpArtist(createAuthDto);
  }

  @Post('/sign-in-artist')
  @HttpCode(HttpStatus.OK)
  signInArtist(@Body() signInAuth: SignInAuthDto) {
    return this.authService.signInArtist(signInAuth);
  }
}
