import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ArtistService } from 'src/artist/artist.service';
import { SongService } from 'src/song/song.service';
import { AuthGuard } from 'src/_core/guards/auth.guard';

@Injectable()
@UseGuards(AuthGuard)
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private artistService: ArtistService,
    private songService: SongService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByUsername(createUserDto.username)) {
      throw new BadRequestException(`Username already in use`);
    }

    const password = await bcrypt.hash(createUserDto.password, 8);
    const createdUser = new this.userModel({ ...createUserDto, password });
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string) {
    const userByEmail = await this.userModel.findOne({ username });

    return userByEmail;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // Like a Song
  async likeSong(userId: string, songId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const song = await this.songService.findOne(songId);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    if (user.likedSongs.some((likedSong) => likedSong.toString() === songId)) {
      throw new BadRequestException('You have already liked this song');
    }

    user.likedSongs.push(song);
    return user.save();
  }

  // Follow an Artist
  async followArtist(userId: string, artistId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const artist = await this.artistService.findOne(artistId);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (
      user.followedArtists.some(
        (followedArtist) => followedArtist.toString() === artistId,
      )
    ) {
      throw new BadRequestException('You are already following this artist');
    }

    user.followedArtists.push(artist);
    return user.save();
  }

  async unlikeSong(userId: string, songId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const song = await this.songService.findOne(songId);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const songIndex = user.likedSongs.findIndex(
      (likedSong) => likedSong.toString() === songId,
    );
    if (songIndex === -1) {
      throw new BadRequestException('You have not liked this song');
    }

    // Remove song from likedSongs array
    user.likedSongs.splice(songIndex, 1);
    return user.save();
  }

  async unfollowArtist(userId: string, artistId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const artist = await this.artistService.findOne(artistId); // Assuming artistService exists and has findOne method
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const artistIndex = user.followedArtists.findIndex(
      (followedArtist) => followedArtist.toString() === artistId,
    );
    if (artistIndex === -1) {
      throw new BadRequestException('You are not following this artist');
    }

    // Remove artist from followedArtists array
    user.followedArtists.splice(artistIndex, 1);
    return user.save();
  }
}
