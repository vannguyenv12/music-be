import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  username: string;
  @Expose()
  role: string;
  @Expose()
  profilePicture: string;
  @Expose()
  playlists: string;
  @Expose()
  favorites: string;
  @Expose()
  followedArtists: string;
}
