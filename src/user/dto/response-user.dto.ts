import { Expose } from 'class-transformer';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';

export class ResponseUserDto {
  @ExposeId()
  _id: string;
  @Expose()
  username: string;
  @Expose()
  name: string;
  @Expose()
  bio: string;
  @Expose()
  role: string;
  @Expose()
  profilePicture: string;
}
