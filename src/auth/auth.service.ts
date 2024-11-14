import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/_utils/token.utils';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { ArtistService } from 'src/artist/artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = await this.userService.create(createAuthDto);

    return {
      accessToken: await generateToken(user, this.jwtService),
    };
  }

  async signIn(signInAuth: SignInAuthDto) {
    const user = await this.userService.findOneByUsername(signInAuth.username);

    if (!user) throw new BadRequestException('Bad Credentials');

    const isMatch = await bcrypt.compare(signInAuth.password, user.password);
    if (!isMatch) throw new BadRequestException('Bad Credentials');

    return {
      accessToken: await generateToken(user, this.jwtService),
    };
  }

  async signUpArtist(createArtistDto: CreateArtistDto) {
    const artist = await this.artistService.create(createArtistDto);

    return {
      accessToken: await generateToken(artist, this.jwtService),
    };
  }

  async signInArtist(createArtistDto: SignInAuthDto) {
    const user = await this.artistService.findOneByUsername(
      createArtistDto.username,
    );

    if (!user) throw new BadRequestException('Bad Credentials');

    const isMatch = await bcrypt.compare(
      createArtistDto.password,
      user.password,
    );
    if (!isMatch) throw new BadRequestException('Bad Credentials');

    return {
      accessToken: await generateToken(user, this.jwtService),
    };
  }
}
