import { IsString } from 'class-validator';

export class LikeSongDto {
  @IsString()
  songId: string;
}
