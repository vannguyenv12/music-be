import { IsString } from 'class-validator';

export class FollowArtistDto {
  @IsString()
  artistId: string;
}
