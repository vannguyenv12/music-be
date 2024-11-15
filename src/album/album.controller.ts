import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './schemas/album.schema';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { AuthGuard } from 'src/_core/guards/auth.guard';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { ResponseAlbumDto } from './dto/response-album.dto';

@Controller('albums')
@TransformDTO(ResponseAlbumDto)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createAlbumDto: CreateAlbumDto,
    @CurrentUser() user,
  ): Promise<Album> {
    return this.albumService.create(createAlbumDto, user);
  }

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Album> {
    return this.albumService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.albumService.remove(id);
  }

  @Post('/add-songs')
  async addSongs(
    @Body('albumId') albumId: string,
    @Body('songIds') songIds: string[],
  ): Promise<Album> {
    return this.albumService.addSongsToAlbum(albumId, songIds);
  }

  @Post('/remove-songs')
  async removeSongs(
    @Body('albumId') albumId: string,
    @Body('songIds') songIds: string[],
  ): Promise<Album> {
    return this.albumService.removeSongsFromAlbum(albumId, songIds);
  }
}
