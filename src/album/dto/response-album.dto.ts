import { Expose, Transform, Type } from 'class-transformer';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';
import { ResponseSongDto } from 'src/song/dto/response-song.dto';

export class ResponseAlbumDto {
  @ExposeId()
  _id: string;

  @Expose()
  title: string;

  @Expose()
  coverImage?: string;

  //   @Expose()
  //   songs?: string[];

  @Expose()
  @Transform(({ obj }) => obj?.songs)
  @Type(() => ResponseSongDto)
  songs: ResponseSongDto[];

  @Expose()
  releaseDate?: Date;

  @Expose()
  @Transform(({ obj }) => obj?.artist?.name)
  artistName: string;

  @Expose()
  @Transform(({ obj }) => obj?.artist?.bio)
  artistBio: string;
}
