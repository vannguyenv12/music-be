import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './schemas/genre.schema';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { ResponseGenreDto } from './dto/response-genre.dto';

@Controller('genres')
@TransformDTO(ResponseGenreDto)
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // CREATE
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreService.create(createGenreDto);
  }

  // READ ALL
  @Get()
  async findAll(): Promise<Genre[]> {
    return this.genreService.findAll();
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre> {
    return this.genreService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<Genre> {
    return this.genreService.update(id, updateGenreDto);
  }

  // SOFT DELETE
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Genre> {
    return this.genreService.remove(id);
  }
}
