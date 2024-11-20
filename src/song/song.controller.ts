import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { AudioUploadDto } from './dto/audio-upload.dto';
import { CreateSongDto } from './dto/create-song.dto';
import { ResponseSongDto } from './dto/response-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { AudioFileInterceptor } from './interceptors/upload-audio.interceptor';
import { SongService } from './song.service';
import getAudioDurationInSeconds from 'get-audio-duration';
import { CoverImageInterceptor } from './interceptors/upload-image.interceptor';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { AuthGuard } from 'src/_core/guards/auth.guard';

@Controller('songs')
@TransformDTO(ResponseSongDto)
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;

    const result = await this.songService.findAll(pageNum, limitNum);

    return {
      data: result.data,
      total: result.total,
      currentPage: pageNum,
      totalPages: Math.ceil(result.total / limitNum),
      hasMore: result.hasMore,
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMySongs(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() currentUser: User,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;

    const result = await this.songService.findMySong(
      pageNum,
      limitNum,
      currentUser,
    );

    return {
      data: result.data,
      total: result.total,
      currentPage: pageNum,
      totalPages: Math.ceil(result.total / limitNum),
      hasMore: result.hasMore,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Get(':slug/slug')
  findOneSlug(@Param('slug') slug: string) {
    return this.songService.findOneBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(id);
  }

  @Post('upload-audio')
  @UseInterceptors(AudioFileInterceptor)
  async uploadAudioFile(
    @UploadedFile() audioFile: Express.Multer.File,
    @Body() audioUploadDto: AudioUploadDto,
  ) {
    if (!audioFile) {
      throw new BadRequestException('Only mp3 files are allowed');
    }

    const filePath = `./uploads/audio/${audioFile.filename}`;
    const duration = await getAudioDurationInSeconds(filePath);

    return this.songService.updateAudioFile(
      audioUploadDto.songId,
      audioFile.filename,
      duration,
    );
  }

  @Get(':songId/likes')
  async getSongLikesCount(@Param('songId') songId: string) {
    return this.songService.getSongLikesCount(songId);
  }

  @Post(':id/upload-cover')
  @UseInterceptors(CoverImageInterceptor)
  async uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Invalid file format');
    }
    return this.songService.updateCoverImage(id, file.filename);
  }
}
