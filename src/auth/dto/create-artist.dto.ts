import { IsString, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateArtistDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsArray()
  genres?: string[];

  @IsOptional()
  @IsArray()
  albums?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  songs?: Types.ObjectId[];
}
