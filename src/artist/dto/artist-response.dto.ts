import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';

export class ResponseArtistDto {
  @ExposeId()
  _id: string;
  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  bio?: string;

  @Expose()
  profilePicture?: string;

  @Expose()
  genres?: string[];

  @Expose()
  albums?: Types.ObjectId[];

  @Expose()
  songs?: Types.ObjectId[];
}
