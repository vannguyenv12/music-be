import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';

export class ResponseSongDto {
  @ExposeId()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  @Transform(({ obj }) => obj?.artist?._id)
  artist: Types.ObjectId;
  @Expose()
  album?: Types.ObjectId;
  @Expose()
  @Transform(({ obj }) => obj?.artist?.name)
  artistName?: string;
  @Expose()
  genre?: string;
  @Expose()
  duration?: number;
  @Expose()
  audioFile: string;
  @Expose()
  coverImage?: string;
  @Expose()
  releaseDate?: Date;
  @Expose()
  slug: string;
}
