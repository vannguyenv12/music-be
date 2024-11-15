import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Song } from 'src/song/schemas/song.schema';
import { SongService } from 'src/song/song.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private songService: SongService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, artist): Promise<Album> {
    const newAlbum = new this.albumModel({
      ...createAlbumDto,
      artist: artist._id,
    });
    return newAlbum.save();
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.find().populate('artist').exec();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumModel
      .findById(id)
      .populate('artist')
      .populate('songs')
      .exec();

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumModel.findById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    Object.assign(album, updateAlbumDto);
    return album.save();
  }

  async remove(id: string): Promise<void> {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
  }

  async addSongsToAlbum(albumId: string, songIds: string[]): Promise<Album> {
    const album = await this.albumModel.findById(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    for (const songId of songIds) {
      const songExists = album.songs.some((song) => song.toString() === songId);

      if (!songExists) {
        const song = await this.songService.findOne(songId);

        album.songs.push(song);
      }
    }

    return album.save();
  }

  async removeSongsFromAlbum(
    albumId: string,
    songIds: string[],
  ): Promise<Album> {
    const album = await this.albumModel.findById(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    for (const songId of songIds) {
      const songIndex = album.songs.findIndex(
        (song) => song.toString() === songId,
      );

      if (songIndex !== -1) {
        album.songs.splice(songIndex, 1);
      }
    }

    return album.save();
  }
}
