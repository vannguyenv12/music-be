import { Expose, Transform, Type } from 'class-transformer';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';
import { ResponseSongDto } from 'src/song/dto/response-song.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

export class ResponsePlaylistDto {
  @ExposeId()
  _id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => ResponseUserDto)
  creator: ResponseUserDto;

  @Expose()
  @Type(() => ResponseSongDto)
  songs?: ResponseSongDto[];

  @Expose()
  coverImage?: string;

  @Expose()
  isPublic?: boolean;
}
