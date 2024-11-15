import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;
  @IsOptional()
  @IsString()
  genre?: string;
}
