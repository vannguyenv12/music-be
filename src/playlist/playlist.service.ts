import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SongService } from 'src/song/song.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    private readonly songService: SongService,
  ) {}

  // Create a new playlist
  async create(createPlaylistDto: CreatePlaylistDto, user): Promise<Playlist> {
    const newPlaylist = new this.playlistModel({
      ...createPlaylistDto,
      creator: user._id,
    });
    return newPlaylist.save();
  }

  // Find all playlists
  async findAll(): Promise<Playlist[]> {
    return this.playlistModel
      .find()
      .populate('creator')
      .populate('songs')
      .exec();
  }

  async findMyPlaylists(user): Promise<Playlist[]> {
    return this.playlistModel
      .find({ creator: user._id })
      .populate('creator')
      .populate('songs')
      .exec();
  }

  // Find a single playlist by id
  async findOne(id: string) {
    const playlist = await this.playlistModel
      .findById(id)
      .populate('creator')
      .populate('songs', '_id username name')
      .exec();

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  // Update a playlist
  async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const existingPlaylist = await this.findOne(id);
    if (!existingPlaylist) {
      throw new NotFoundException('Playlist not found');
    }

    // Cập nhật playlist với thông tin mới
    Object.assign(existingPlaylist, updatePlaylistDto);

    return existingPlaylist.save();
  }

  // Remove a playlist
  async remove(id: string): Promise<void> {
    const result = await this.playlistModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Playlist not found');
    }
  }

  // Add songs to playlist
  async addSongsToPlaylist(
    playlistId: string,
    songIds: string[],
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    for (const songId of songIds) {
      const songExists = playlist.songs.some(
        (song) => song.toString() === songId,
      );

      if (!songExists) {
        const song = await this.songService.findOne(songId);

        playlist.songs.push(song);
      }
    }

    // Lưu và trả về playlist đã cập nhật
    return playlist.save();
  }

  // Remove songs from playlist
  async removeSongsFromPlaylist(
    playlistId: string,
    songIds: string[],
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    for (const songId of songIds) {
      const songIndex = playlist.songs.findIndex(
        (song) => song.toString() === songId,
      );

      if (songIndex !== -1) {
        playlist.songs.splice(songIndex, 1);
      }
    }

    return playlist.save();
  }
}
