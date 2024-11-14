import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  _id: string;
  @Expose()
  username: string;
  @Expose()
  name: string;
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
