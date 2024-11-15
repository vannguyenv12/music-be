import { IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
