import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
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
import { UserProfilePictureInterceptor } from './interceptors/user-avatar.interceptor';

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

  @Get('check-like-song')
  async checkLikeSong(@Query('songId') songId: string, @CurrentUser() user) {
    return this.userService.checkLikeSong(user._id, songId);
  }

  @Get('check-follow-artist')
  async checkFollowArtist(
    @Query('artistId') artistId: string,
    @CurrentUser() user,
  ) {
    return this.userService.checkFollowArtist(user._id, artistId);
  }

  @Get('/me')
  getMe(@CurrentUser() user) {
    return this.userService.findMe(user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softDelete(id);
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

  @Post('upload-profile-picture')
  @UseInterceptors(UserProfilePictureInterceptor)
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Invalid file format. Only JPEG and PNG are allowed.',
      );
    }
    return this.userService.uploadProfilePicture(file.filename, user);
  }
}
