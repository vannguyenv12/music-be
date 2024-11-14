import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  artist: Types.ObjectId;

  @IsOptional()
  album?: Types.ObjectId;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  audioFile: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: Date;
}
