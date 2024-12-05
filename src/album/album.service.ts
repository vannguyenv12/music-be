import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SongService } from 'src/song/song.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

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

  async findAllPaginate(page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.albumModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('artist')
        .sort({ releaseDate: 1 })
        .exec(),
      this.albumModel.countDocuments(),
    ]);

    const hasMore = skip + limit < total;

    return { data, total, hasMore };
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
