import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  // CREATE
  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = new this.genreModel(createGenreDto);
    return genre.save();
  }

  // READ (Find All)
  async findAll(): Promise<Genre[]> {
    return this.genreModel.find({ isDelete: false }).exec(); // Only return genres that are not marked as deleted
  }

  // READ (Find One by ID)
  async findOne(id: string) {
    const genre = await this.genreModel.findById(id).exec();
    if (!genre || genre.isDelete) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }

  // UPDATE
  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    genre.name = updateGenreDto.name ?? genre.name;
    genre.description = updateGenreDto.description ?? genre.description;

    return genre.save();
  }

  // SOFT DELETE
  async remove(id: string): Promise<Genre> {
    const genre = await this.findOne(id);
    genre.isDelete = true; // Mark as deleted

    return genre.save();
  }
}
