import { IsOptional, IsString } from 'class-validator';

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
}
