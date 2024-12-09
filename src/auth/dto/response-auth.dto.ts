import { Expose, Type } from 'class-transformer';

class User {
  @Expose()
  username: string;
  @Expose()
  name: string;
  @Expose()
  profilePicture: string;
  @Expose()
  provider: string;
  @Expose()
  role: 'admin' | 'user';
}

export class ResponseAuthDto {
  @Expose()
  accessToken: string;
  @Expose()
  @Type(() => User)
  user: User;
}
