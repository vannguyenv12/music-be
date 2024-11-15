import { IsString, IsOptional } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
