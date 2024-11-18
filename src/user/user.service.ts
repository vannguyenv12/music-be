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
import { Artist } from 'src/artist/schemas/artist.schema';

@Injectable()
@UseGuards(AuthGuard)
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    private artistService: ArtistService,
    private songService: SongService,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByUsername(createUserDto.username)) {
      throw new BadRequestException(`Username already in use`);
    }

    if (createUserDto.username.startsWith('admin')) {
      const password = await bcrypt.hash(createUserDto.password, 8);
      const createdUser = new this.userModel({
        ...createUserDto,
        role: 'admin',
        password,
      });
      return createdUser.save();
    }

    const password = await bcrypt.hash(createUserDto.password, 8);
    const createdUser = new this.userModel({ ...createUserDto, password });
    return createdUser.save();
  }

  // Find all active users
  async findAll() {
    return this.userModel.find({ isActive: { $ne: false } });
  }

  // Find one user by ID
  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      isActive: { $ne: false },
    });

    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async findMe(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      isActive: { $ne: false },
    });

    if (!user) {
      const artist = await this.artistModel.findOne({
        _id: id,
      });

      return artist;
    }
    return user;
  }

  // Find user by username
  async findOneByUsername(username: string) {
    const userByEmail = await this.userModel.findOne({
      username,
      isActive: { $ne: false },
    });
    return userByEmail;
  }

  // Update user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    user.name = updateUserDto.name;
    return user.save();
  }

  // Soft delete a user (set isActive to false)
  async softDelete(id: string) {
    const user = await this.findOne(id);
    user.isActive = false;
    return user.save();
  }

  // Like a song
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

  // Follow an artist
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

  // Unlike a song
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

  // Unfollow an artist
  async unfollowArtist(userId: string, artistId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const artist = await this.artistService.findOne(artistId);
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

  async uploadProfilePicture(fileName: string, currentUser) {
    const user = await this.findOne(currentUser._id);

    user.profilePicture = fileName;

    return user.save();
  }
}
