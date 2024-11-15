import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from './schemas/artist.schema';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findOneByUsername(username: string) {
    const userByEmail = await this.artistModel.findOne({ username });

    return userByEmail;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (await this.findOneByUsername(createArtistDto.username)) {
      throw new BadRequestException(`Username already in use`);
    }

    const password = await bcrypt.hash(createArtistDto.password, 8);

    const createdArtist = new this.artistModel({
      ...createArtistDto,
      password,
    });
    return createdArtist.save();
  }

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().exec();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistModel.findById(id).exec();
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, updateArtistDto);
    return artist.save();
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistModel.findByIdAndDelete(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
  }

  async getArtistFollowCount(artistId: string): Promise<number> {
    const users = await this.userModel.find({
      followedArtists: artistId,
    });

    return users.length;
  }
}
