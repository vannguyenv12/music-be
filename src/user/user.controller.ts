import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthGuard } from 'src/_core/guards/auth.guard';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { LikeSongDto } from './dto/like-song.dto';
import { FollowArtistDto } from './dto/follow-artist.dto';

@Controller('users')
@UseGuards(AuthGuard)
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/me')
  getMe(@CurrentUser() user) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('like-song')
  async likeSong(@Body() likeSongDto: LikeSongDto, @CurrentUser() user) {
    return this.userService.likeSong(user._id, likeSongDto.songId);
  }

  @Post('follow-artist')
  async followArtist(
    @Body() followArtistDto: FollowArtistDto,
    @CurrentUser() user,
  ) {
    return this.userService.followArtist(user._id, followArtistDto.artistId);
  }

  @Post('unlike-song')
  async unlikeSong(@Body() unlikeSongDto: LikeSongDto, @CurrentUser() user) {
    return this.userService.unlikeSong(user._id, unlikeSongDto.songId);
  }

  @Post('unfollow-artist')
  async unfollowArtist(
    @Body() unfollowArtistDto: FollowArtistDto,
    @CurrentUser() user,
  ) {
    return this.userService.unfollowArtist(
      user._id,
      unfollowArtistDto.artistId,
    );
  }
}
