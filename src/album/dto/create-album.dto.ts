import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  songs?: string[];

  @IsOptional()
  @IsDateString()
  releaseDate?: Date;
}
