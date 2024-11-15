import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './schemas/song.schema';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import getAudioDurationInSeconds from 'get-audio-duration';

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}
  async findSongsByIds(songIds: string[]): Promise<Song[]> {
    return this.songModel.find({ _id: { $in: songIds } }).exec();
  }

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const newSong = new this.songModel(createSongDto);
    return newSong.save();
  }

  async findAll(): Promise<Song[]> {
    const songs = await this.songModel.find().exec();
    return songs;
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songModel.findById(id).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
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
    console.log('hit service');
    const song = await this.songModel.findById(songId);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    song.audioFile = audioFile;
    song.duration = duration;
    return song.save();
  }
}
