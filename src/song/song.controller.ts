import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
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

@Controller('songs')
@TransformDTO(ResponseSongDto)
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @Get()
  findAll() {
    return this.songService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
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
}
