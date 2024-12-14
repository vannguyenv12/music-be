import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from 'src/_core/guards/auth.guard';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { ResponsePlaylistDto } from './dto/response-playlist.dto';

@Controller('playlists')
@TransformDTO(ResponsePlaylistDto)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // Create a new playlist
  @Post()
  async create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @CurrentUser() user,
  ) {
    return this.playlistService.create(createPlaylistDto, user);
  }

  // Get all playlists
  @Get()
  async findAll() {
    return this.playlistService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async findMy(@CurrentUser() user) {
    return this.playlistService.findMyPlaylists(user);
  }

  // Get a playlist by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playlistService.findOne(id);
  }

  // Update a playlist by id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  // Delete a playlist by id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }

  // Add songs to playlist
  @Post(':id/songs')
  async addSongs(@Param('id') id: string, @Body('songIds') songIds: string[]) {
    return this.playlistService.addSongsToPlaylist(id, songIds);
  }

  // Remove songs from playlist
  @Delete(':id/songs')
  async removeSongs(
    @Param('id') id: string,
    @Body('songIds') songIds: string[],
  ) {
    return this.playlistService.removeSongsFromPlaylist(id, songIds);
  }
}
