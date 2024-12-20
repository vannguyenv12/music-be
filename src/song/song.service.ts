import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './schemas/song.schema';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { User } from 'src/user/schemas/user.schema';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SongService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<Song>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async findSongsByIds(songIds: string[]): Promise<Song[]> {
    return this.songModel.find({ _id: { $in: songIds } }).exec();
  }

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const newSong = new this.songModel(createSongDto);
    return newSong.save();
  }

  async findAll(page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.songModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('artist')
        .sort({ releaseDate: 1 })
        .exec(),
      this.songModel.countDocuments(),
    ]);

    const hasMore = skip + limit < total;

    return { data, total, hasMore };
  }

  async findMySong(page = 1, limit = 6, artist) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.songModel
        .find({ artist: artist._id })
        .skip(skip)
        .limit(limit)
        .populate('artist')
        .sort({ releaseDate: 1 })
        .exec(),
      this.songModel.find({ artist: artist._id }).countDocuments(),
    ]);

    const hasMore = skip + limit < total;

    return { data, total, hasMore };
  }

  async findOne(id: string) {
    console.log('check id', id);

    const song = await this.songModel.findById(id).exec();
    if (!song) {
      throw new NotFoundException(`Song not found`);
    }
    return song;
  }

  async findOneBySlug(slug: string) {
    const song = await this.songModel.findOne({ slug }).exec();
    if (!song) {
      throw new NotFoundException(`Song  not found`);
    }
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    const updatedSong = await this.songModel
      .findByIdAndUpdate(id, updateSongDto, { new: true })
      .exec();
    if (!updatedSong) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return updatedSong;
  }

  async remove(id: string): Promise<void> {
    const result = await this.songModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  }

  async updateAudioFile(
    songId: string,
    audioFile: string,
    duration: number,
  ): Promise<Song> {
    const song = await this.songModel.findById(songId);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    song.audioFile = audioFile;
    song.duration = duration;
    return song.save();
  }

  async getSongLikesCount(songId: string): Promise<number> {
    const users = await this.userModel.find({
      likedSongs: songId,
    });

    return users.length;
  }

  async updateCoverImage(id: string, fileName: string) {
    const song = await this.findOne(id);

    song.coverImage = fileName;

    return song.save();
  }
}
